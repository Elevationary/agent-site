# Session Handover

_Last updated: 2026-04-25_

---

## Active Project: Migrate_ElevationaryCom (elevationary-main-site)

**Repo:** `/Users/jamesszmak/Antigravity/micro-site/elevationary-main-site`
**Deployed:** Cloudflare Pages → `elevationary.com` (live, DNS cutover complete 2026-04-22)

**Phase 1 Status:** FULLY CLOSED as of 2026-04-24 (GSC sitemap submitted, 7 pages discovered).

### Phase 2 Gate (blocked)
- Requires: Elevationary_OS design doc from James (task_ec000004)

### Open Decisions (James)
- **task_ec000003**: elevationary.ai — redirect to elevationary.com, or standalone site?
- **task_ec000004**: Elevationary_OS design doc for Phase 2 visual design
- ~~task_ec000005~~: Resolved — R2 manifest spec v1.0 agreed with Newsletter Agent

### Key Lesson — Cloudflare Redirect Loop (2026-04-22)
A pre-existing Single Redirect rule named "Apex → www.elevationary.com" was active in the Cloudflare zone. Combined with our new www→apex Bulk Redirect, this created an infinite 301 loop. Found via **Rules → Trace**. Deleted the Single Redirect rule to resolve. **Before adding any www→apex or apex→www rules to a zone, always run Rules → Trace first to check for conflicting rules.**

---

## Agent Site (agent.elevationary.com)

**Repo:** `/Users/jamesszmak/Antigravity/micro-site/agent-site`
**Last commit:** `9f559d5` (docs: ORS PASS — 3-tier unlock page)

### Completed this session (2026-04-25)
- HubSpot fully deprecated — native `subscribe-form.njk`, `hubspot-form.njk` deleted, HubSpot block removed from `site.json`
- `subscribe.js` — From/ReplyTo/welcome copy final, D1 fail-hard, Postmark response.ok check, HMAC unsubscribe tokens
- `functions/api/unsubscribe.js` — HMAC-SHA256 verification, D1 update, `?status=invalid` UX
- `/success/` + `/unsubscribed/` + `/activate/` pages
- `POSTMARK_SERVER_TOKEN` + `UNSUBSCRIBE_SECRET` deployed to agent-site2
- R2 binding `NEWSLETTER_BUCKET` → `gemini-content-factory`; manifest spec v1.0 locked
- Postmark broadcast streams: `nonprofit` (topics 1–10), `corporate` (topics 11–20)
- Postmark approval submitted 2026-04-25 — awaiting Monday 2026-04-27
- Stripe live catalog: 3-tier products + 6 prices created (Individual $29/$290, Bundle $69/$690, All-Access $149/$1,490)
- Restricted `sk_live_` key deployed to agent-site2; `pk_live_` embedded in `/subscribe/`
- D1 schema migration: `subscriber_topics` + `subscriber_events` tables live on remote
- `/subscribe/` — 20-topic checkboxes (nonprofit/corporate), optional Stripe SetupIntent CC capture, `pk_live_`
- `/unlock/` — full 3-tier pricing page, monthly/annual toggle, all 6 plan keys, live checkout verified (`cs_live_`)
- `/api/setup-intent`, `/api/gate`, `/api/activate` Workers — SetupIntent, 4-path gating, one-click upgrade
- Master Business Plan §9.4 — HubSpot deprecation documented for fleet
- Memory system initialised — 4 files
- ORS PASS × 4 — subscribe/unsubscribe, Stripe migration, subscription flow, 3-tier unlock (8 total findings remediated)

### Next — Phase 4: Content Pipeline
_Architecture: D1 + Postmark (nonprofit/corporate streams) + R2 (NEWSLETTER_BUCKET)_
_Gate: Postmark approval expected 2026-04-27 (Monday)_

- **Manifest poller Worker** — hourly Cloudflare cron, polls R2, checks approval record, orchestrates Postmark send. Requirements: skip "ORS test" approvals; send complete topics, skip failed, Telegram page James on failures; Telegram page on completion with count; notify Newsletter Agent "poller is live" on first deploy
- **D1 → Postmark subscriber sync** — route subscribers to correct stream (nonprofit/corporate) by `subscriber_topics`
- **Site publisher** — premium R2 content → published pages + subscriber access URLs
- **Preview subscribers** — Stripe promo code (100% off, 30-day) + seed 100 contacts. Gate: Postmark approved

### Phase 5: Homepage Redesign + GUI (separate session)
- Homepage redesign, subscriber GUI (approve/review UI), full visual redesign (blocked on task_ec000004)

### Remaining Queue (in order)
1. **Postmark approval** — await Monday 2026-04-27
2. **Phase 4 content pipeline** — manifest poller → subscriber sync → site publisher
3. **Preview subscribers** — Stripe promo + 100 contacts (after Postmark approval)
4. **Homepage redesign + GUI** — separate session
5. **elevationary.ai disposition** (task_ec000003)
6. **Twitter @ElevationaryAI** — James creates account
7. **Elevationary_OS design doc** (task_ec000004)

---

## Do Not Re-Try (agent-site)
- Do NOT run `startup.py` or `shutdown.py` — Gemini owns these
- **Cloudflare Pages project name:** The live project is `agent-site2` (has Git + `agent.elevationary.com`). `agent-site` is an orphan with no Git integration. Always run `wrangler pages project list` before any wrangler command.
- Do NOT use `wrangler pages secret put` without first confirming the correct project name via `wrangler pages project list`
- Cloudflare bot blocking is injected by Cloudflare, NOT in robots.txt source — fix requires Cloudflare dashboard
- HubSpot is fully deprecated — `hubspot-form.njk` deleted, `site.json` HubSpot block removed. Do not re-add. See Master Business Plan §9.4.
- **Stripe product IDs:** Old "Agent Insider" (`prod_Tp6Mt8OpDrOdyH`) and "CRM Insights" products are archived. All checkout code must use price IDs from `config/stripe-price-ids.json` only. Never hardcode old price IDs.
- **Postmark pending approval:** Submitted 2026-04-25 (Saturday). Expect Monday 2026-04-27. Welcome emails blocked for non-@elevationary.com until approved. Do not seed real subscribers until approval confirmed.
- **Stripe live keys:** `pk_live_` embedded in `/subscribe/`; restricted `sk_live_` deployed to agent-site2. Live checkout verified (`cs_live_` sessions). Price IDs in `config/stripe-price-ids.json` — do not hardcode.
- **`schema.sql` is now a safe migration** — `CREATE TABLE IF NOT EXISTS` only. For first-time empty-database setup, use `scripts/d1-reset.sql`. Never run `d1-reset.sql` against a live database.
- **Cloudflare AI bot architecture:** "Block AI bots" master switch overrides ALL per-bot AI Crawl Control settings. Current state: master = "Do not block," all AI bots allowed.
- `git filter-branch` was used to rewrite 24 commits — rewritten history already on origin/main. No force pull needed (solo repo).
