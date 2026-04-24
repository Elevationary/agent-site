#!/usr/bin/env node
/**
 * stripe-sync.js — Sync config/products.json → Stripe live catalog
 *
 * Usage: STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-sync.js
 *
 * Safe to run repeatedly — looks up existing products/prices by metadata
 * before creating, so it never creates duplicates.
 * Outputs updated config/stripe-price-ids.json for use in checkout.js.
 */

import Stripe from 'stripe';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const key = process.env.STRIPE_SECRET_KEY;
if (!key || !key.startsWith('sk_live_')) {
    console.error('ERROR: STRIPE_SECRET_KEY must be a live key (sk_live_...)');
    process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: '2023-10-16' });
const { products } = JSON.parse(readFileSync(join(root, 'config/products.json'), 'utf8'));

const priceIds = {};

for (const product of products) {
    console.log(`\nSyncing: ${product.name}`);

    // Find or create the product (keyed by metadata.product_id)
    const existing = await stripe.products.search({
        query: `metadata['product_id']:'${product.id}'`,
    });

    let stripeProduct;
    if (existing.data.length > 0) {
        stripeProduct = existing.data[0];
        console.log(`  Product exists: ${stripeProduct.id}`);
    } else {
        stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.description,
            metadata: { product_id: product.id },
        });
        console.log(`  Product created: ${stripeProduct.id}`);
    }

    priceIds[product.id] = {};

    for (const [billingKey, pricing] of Object.entries(product.prices)) {
        // Find existing active price for this product + interval
        const existingPrices = await stripe.prices.list({
            product: stripeProduct.id,
            active: true,
            recurring: { interval: pricing.interval },
        });

        const match = existingPrices.data.find(
            p => p.unit_amount === pricing.amount && p.currency === 'usd'
        );

        let stripePrice;
        if (match) {
            stripePrice = match;
            console.log(`  Price (${billingKey}) exists: ${stripePrice.id}`);
        } else {
            stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: pricing.amount,
                currency: 'usd',
                recurring: { interval: pricing.interval },
                metadata: { product_id: product.id, billing: billingKey },
            });
            console.log(`  Price (${billingKey}) created: ${stripePrice.id}`);
        }

        priceIds[product.id][billingKey] = stripePrice.id;
    }
}

const outPath = join(root, 'config/stripe-price-ids.json');
writeFileSync(outPath, JSON.stringify(priceIds, null, 2) + '\n');
console.log(`\nWrote ${outPath}`);
console.log(JSON.stringify(priceIds, null, 2));
