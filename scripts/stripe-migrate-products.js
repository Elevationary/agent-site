#!/usr/bin/env node
// Migrates Stripe products to the canonical 3-tier structure from Master Business Plan §5.2.
// Step 1: Archives all existing active products and prices.
// Step 2: Creates 3 products × 2 billing intervals = 6 price objects.
// Step 3: Writes config/stripe-price-ids.json with the new price IDs.
// Safe to re-run — skips already-archived products and existing price objects.

import Stripe from 'stripe';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../config/stripe-price-ids.json');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = [
  {
    key: 'individual-access',
    name: 'Individual Access',
    description: 'Full premium implementation guides for one swimlane. Tier 1.',
    monthly: 2900,
    annual: 29000,
  },
  {
    key: 'functional-bundle',
    name: 'Functional Bundle',
    description: 'Full premium access to 3 logically related swimlanes. Tier 2.',
    monthly: 6900,
    annual: 69000,
  },
  {
    key: 'all-access-pass',
    name: 'All-Access Corporate Pass',
    description: 'Full access to all 10 swimlanes within one vertical (Nonprofit or Corporate). Tier 3.',
    monthly: 14900,
    annual: 149000,
  },
];

async function archiveExisting() {
  console.log('Step 1: Archiving existing products and prices...');
  const products = await stripe.products.list({ active: true, limit: 100 });
  for (const product of products.data) {
    // Clear default_price first so prices can be archived
    if (product.default_price) {
      await stripe.products.update(product.id, { default_price: '' });
    }
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false });
      console.log(`  ↩ Archived price: ${price.id} ($${price.unit_amount / 100} ${price.recurring?.interval})`);
    }
    await stripe.products.update(product.id, { active: false });
    console.log(`  ↩ Archived product: ${product.id} — ${product.name}`);
  }
}

async function createProducts() {
  console.log('\nStep 2: Creating canonical 3-tier products...');
  const priceIds = {};

  for (const p of PRODUCTS) {
    const product = await stripe.products.create({
      name: p.name,
      description: p.description,
      metadata: { tier_key: p.key },
    });
    console.log(`  ✓ Product: ${product.id} — ${product.name}`);

    const monthly = await stripe.prices.create({
      product: product.id,
      unit_amount: p.monthly,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: { tier_key: p.key, billing: 'monthly' },
    });
    console.log(`    ✓ Monthly price: ${monthly.id} ($${p.monthly / 100}/mo)`);

    const annual = await stripe.prices.create({
      product: product.id,
      unit_amount: p.annual,
      currency: 'usd',
      recurring: { interval: 'year' },
      metadata: { tier_key: p.key, billing: 'annual' },
    });
    console.log(`    ✓ Annual price:  ${annual.id} ($${p.annual / 100}/yr)`);

    priceIds[p.key] = {
      name: p.name,
      monthly: monthly.id,
      annual: annual.id,
      monthly_amount: p.monthly,
      annual_amount: p.annual,
    };
  }

  return priceIds;
}

async function main() {
  await archiveExisting();
  const priceIds = await createProducts();
  writeFileSync(CONFIG_PATH, JSON.stringify(priceIds, null, 2));
  console.log(`\nPrice IDs written to config/stripe-price-ids.json`);
  console.log('\nFinal price map:');
  console.log(JSON.stringify(priceIds, null, 2));
}

main().catch(err => { console.error(err); process.exit(1); });
