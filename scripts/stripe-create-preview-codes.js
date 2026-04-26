#!/usr/bin/env node
// Creates a Stripe coupon (100% off, first billing period only) and generates
// 100 unique single-use promo codes for preview subscribers.
// Outputs codes to config/preview-promo-codes.csv.
//
// Each code: PREVIEW-XXXXXX (6 random uppercase chars)
// Subscriber checks out normally with the code → pays $0 for 30 days → auto-charges after.
// Works on any of the 3 subscription tiers.

import Stripe from 'stripe';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../config/preview-promo-codes.csv');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CODE_COUNT = 100;

function randomSuffix(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous O/0/I/1
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function main() {
  console.log('Step 1: Creating coupon (100% off, first period only)...');
  const coupon = await stripe.coupons.create({
    name: '30-Day Preview Access',
    percent_off: 100,
    duration: 'once',
    max_redemptions: CODE_COUNT,
    metadata: { campaign: 'preview-2026' },
  });
  console.log(`  ✓ Coupon: ${coupon.id} — ${coupon.name}`);

  console.log(`\nStep 2: Generating ${CODE_COUNT} unique promo codes...`);
  const codes = [];
  const seen = new Set();

  for (let i = 0; i < CODE_COUNT; i++) {
    let suffix;
    do { suffix = randomSuffix(); } while (seen.has(suffix));
    seen.add(suffix);
    const code = `PREVIEW-${suffix}`;

    // Use raw fetch — SDK 20.x has a parameter mapping issue with newer API versions
    const res = await fetch('https://api.stripe.com/v1/promotion_codes', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(process.env.STRIPE_SECRET_KEY + ':')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        coupon: coupon.id, code, max_redemptions: '1',
        'metadata[campaign]': 'preview-2026',
        'metadata[sequence]': String(i + 1),
      }),
    });
    const promoCode = await res.json();
    if (!res.ok) throw new Error(`Stripe error: ${JSON.stringify(promoCode)}`);


    codes.push({ code, id: promoCode.id });
    if ((i + 1) % 10 === 0) process.stdout.write(`  ${i + 1}/${CODE_COUNT}\n`);
  }

  const csv = ['code,stripe_promo_id', ...codes.map(c => `${c.code},${c.id}`)].join('\n');
  writeFileSync(OUT_PATH, csv);

  console.log(`\n✓ Done. ${CODE_COUNT} codes written to config/preview-promo-codes.csv`);
  console.log(`  Coupon ID: ${coupon.id}`);
  console.log(`  Sample codes: ${codes.slice(0, 3).map(c => c.code).join(', ')} ...`);
  console.log('\nInstructions:');
  console.log('  1. Send one code per preview contact');
  console.log('  2. Contact goes to /subscribe/, selects topics, completes checkout with code');
  console.log('  3. Stripe charges $0 today — auto-charges after first billing period');
}

main().catch(err => { console.error(err); process.exit(1); });
