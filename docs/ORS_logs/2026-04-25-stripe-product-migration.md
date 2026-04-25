# ORS Log: Stripe Product Migration — 3-Tier Canonical Structure
**Date:** 2026-04-25 | **Agent:** Claude Code | **Session:** Subscription Infrastructure

---

## Stage 2a: MODEL (Expected Outcome)

- Stripe: exactly 3 active products (Individual Access, Functional Bundle, All-Access Corporate Pass)
- Stripe: exactly 6 active prices — monthly + annual for each product at canonical amounts
  - Individual Access: $29/mo, $290/yr
  - Functional Bundle: $69/mo, $690/yr
  - All-Access Corporate Pass: $149/mo, $1,490/yr
- Legacy product (Agent Insider Subscription) archived, not active
- `config/stripe-price-ids.json` price IDs match live Stripe exactly
- `functions/api/checkout.js` references only active price IDs
- `src/unlock.njk` passes plan keys that resolve in checkout.js

---

## Stage 2b: OBSERVE (Actual Outcome)

**Stripe live state (verified via API):**

Active products:
- `prod_UP3u0oglTV4FIo` — Individual Access ✓
- `prod_UP3uKTILa0jW81` — Functional Bundle ✓
- `prod_UP3ubP3GUXD0gU` — All-Access Corporate Pass ✓

Active prices:
- `price_1TQFmWC3YEf5bh1ixnbGRNZR` — $29/mo (Individual Access) ✓
- `price_1TQFmXC3YEf5bh1iAzU159jh` — $290/yr (Individual Access) ✓
- `price_1TQFmXC3YEf5bh1i5bWCS1DA` — $69/mo (Functional Bundle) ✓
- `price_1TQFmXC3YEf5bh1iasqopAOW` — $690/yr (Functional Bundle) ✓
- `price_1TQFmYC3YEf5bh1iOcuJnrAF` — $149/mo (All-Access Corporate Pass) ✓
- `price_1TQFmYC3YEf5bh1iWoHeU6RP` — $1,490/yr (All-Access Corporate Pass) ✓

Archived products:
- `prod_Tp6Mt8OpDrOdyH` — Agent Insider Subscription ✓

`config/stripe-price-ids.json` — 6 price IDs match live Stripe exactly ✓

`functions/api/checkout.js` — **referenced archived price IDs** (`price_1TPn0CC...`, `price_1TPn0DC...`) ✗

`src/unlock.njk` — **passed stale plan keys** (`monthly`, `annual`) not present in new PRICE_IDS map ✗

---

## Stage 2c: COMPARE
- [X] Stripe products and prices match expected — clean
- [X] Config file matches live Stripe — clean
- [ ] checkout.js — FAIL: hardcoded archived price IDs
- [ ] unlock.njk — FAIL: stale plan keys

---

## Stage 3: RED-TEAM Findings

| Question | Answer | Action Required? |
|---|---|---|
| Credential expiry? | STRIPE_SECRET_KEY is a Cloudflare Pages secret — no expiry. Test key in .env confirmed separate from live key on agent-site2. | No |
| Silent failure on dependency loss? | checkout.js: archived price ID would return Stripe error logged and surfaced to user as 400. Not silent. | No (after fix) |
| try/except printing generic messages? | checkout.js catches Stripe errors and returns `err.message` — specific, not generic | No |
| Monitoring uses same code paths? | No monitoring on checkout failures yet — Phase 4 item | No |
| Agent-authored files protected? | stripe-price-ids.json, stripe-migrate-products.js committed to git | Yes |
| Blast radius if fails at 3am? | Checkout failure returns 400 JSON — user sees error, no charge occurs. No data corruption risk. | No |
| checkout.js uses archived price IDs? | **YES** — PRICE_IDS map pointed to `price_1TPn0CC...` (archived). Any checkout attempt would fail at Stripe. | **FIXED** |
| unlock.njk passes resolvable plan keys? | **NO** — buttons passed `monthly`/`annual`. New map requires `individual-access-monthly` etc. | **FIXED** |
| Full 3-tier UI present on unlock.njk? | No — unlock.njk is a stopgap (Tier 1 only). Full 3-tier redesign is a separate sprint. | Backlog |

---

## Stage 4: REMEDIATION

**Finding 1: checkout.js archived price IDs**
- Rewrote PRICE_IDS map with all 6 canonical keys and new active price IDs
- Keys now follow `{tier_key}-{billing}` pattern: `individual-access-monthly`, `individual-access-annual`, etc.
- Comment added pointing to `config/stripe-price-ids.json` as the source of truth

**Finding 2: unlock.njk stale plan keys**
- Updated both buttons to pass `individual-access-monthly` and `individual-access-annual`
- Updated pricing display: $29/mo, $290/yr (was $19.95/$199.95)
- Updated product name to "Individual Access" (was "Agent Insider")
- Note: Full 3-tier UI (all three tiers with topic selection) is a separate redesign sprint — logged in backlog

---

## Stage 5: RETEST

- [X] `npm run build` — 20 files, 0 errors ✓
- [X] Stripe API: 3 active products, 6 active prices confirmed ✓
- [X] Price IDs in checkout.js cross-referenced against config/stripe-price-ids.json — all 6 match ✓
- [X] unlock.njk plan keys (`individual-access-monthly`, `individual-access-annual`) present in checkout.js PRICE_IDS map ✓
- [X] Legacy product archived, not in active list ✓
- [X] Clean pass ✓

---

## Result
- [X] **ORS PASS** — all 5 stages complete, 2 findings remediated, clean retest

## Carry-Forward
- [ ] Full 3-tier UI on unlock.njk (Tier 1/2/3 with topic selection) — separate redesign sprint
