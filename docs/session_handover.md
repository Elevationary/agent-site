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
**Last commit:** `82dc8da` (docs: ORS PASS — preview promo codes)

### Completed this session (2026-04-25/26)
- HubSpot fully deprecated — native subscribe form, unsubscribe Worker, confirmation pages
- Postmark welcome email wired — "Elevationary Thinking", ReplyTo: replies@, List-Unsubscribe, HMAC tokens
- Postmark broadcast streams live: `nonprofit` (1–10), `corporate` (11–20)
- Postmark approval submitted 2026-04-25 — awaiting 2026-04-27 (Monday)
- Stripe live catalog: 3 products × 6 prices; restricted `sk_live_` on agent-site2; `pk_live_` on /subscribe/
- D1 schema: `subscriber_topics` + `subscriber_events` tables live on remote
- `/subscribe/` — 20-topic checkboxes, optional CC capture (SetupIntent)
- `/unlock/` — full 3-tier pricing, monthly/annual toggle, `cs_live_` checkout verified
- `/api/setup-intent`, `/api/gate`, `/api/activate` Workers — 4-path premium gating, one-click upgrade
- Preview promo codes: coupon `dTwd1p8S` + 100 `PREVIEW-XXXXXX` codes, `allow_promotion_codes: true` on checkout
- Master Business Plan §9.4 — HubSpot deprecation documented; memory system initialised (4 files)
- ORS PASS × 5 — 9 total findings remediated

### Active — Phase 4: Content Pipeline (IN PROGRESS)
_Architecture: D1 + Postmark (nonprofit/corporate streams) + R2 (NEWSLETTER_BUCKET)_
_Postmark gate: approval expected 2026-04-27_

- **Manifest poller Worker** ← BUILDING NOW — hourly Cloudflare cron, R2 poll, approval check, Postmark send orchestrator. Requirements: skip "ORS test" approvals; send complete topics, skip failed + Telegram page James; Telegram page on completion (count); notify Newsletter Agent "poller is live" on first deploy
- **D1 → Postmark subscriber sync** — route subscribers to correct stream by `subscriber_topics.topic_id` series
- **Site publisher** — premium R2 content → published pages + subscriber access URLs
- **Preview subscribers** — send `PREVIEW-XXXXXX` codes to 100 contacts; gate: Postmark approved

### Phase 5: Homepage Redesign + GUI (separate session)
- Homepage redesign, subscriber GUI, visual redesign (blocked on task_ec000004)

### Remaining Queue (in order)
1. **Manifest poller Worker** — IN PROGRESS
2. **D1 → Postmark sync** — after poller
3. **Site publisher** — after sync
4. **Preview subscribers** — after Postmark approval (Monday)
5. **Homepage redesign + GUI** — separate session
6. **elevationary.ai disposition** (task_ec000003)
7. **Twitter @ElevationaryAI** — James creates account
8. **Elevationary_OS design doc** (task_ec000004)

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
