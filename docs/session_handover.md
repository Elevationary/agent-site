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
**Last commit:** `96b9ce9` (fix+docs: ORS PASS — newsletter poller hardening)

### Completed this session (2026-04-25/26)
- HubSpot fully deprecated — native subscribe form, unsubscribe Worker, confirmation pages
- Postmark welcome email, broadcast streams (`nonprofit`/`corporate`), approval submitted 2026-04-25
- Stripe live catalog: 3 products × 6 prices; restricted `sk_live_`; `pk_live_` on /subscribe/
- D1 schema: `subscriber_topics` + `subscriber_events` live on remote
- `/subscribe/` — 20-topic checkboxes, optional CC capture; `/unlock/` — 3-tier, `cs_live_` verified
- `/api/setup-intent`, `/api/gate`, `/api/activate` — 4-path premium gating, one-click upgrade
- Preview promo codes: coupon `dTwd1p8S`, 100 `PREVIEW-XXXXXX` codes, `allow_promotion_codes: true`
- **Manifest poller Worker** — `workers/newsletter-poller/`, hourly cron `0 * * * *`, deployed to Cloudflare
  - D1 + R2 bound, 5 secrets deployed, first-run fired (R2 marker written, Newsletter Agent notified)
  - ORS PASS: crash handler, JSON guard, HTML-escape (3 findings)
  - Carry-forward: Sunday manifest support (Phase 2), full end-to-end test (needs real manifest)
- Memory system initialised (4 files); Master Business Plan §9.4 updated
- ORS PASS × 6 — 12 total findings remediated across all sprints

### Active — Phase 4: Content Pipeline (IN PROGRESS)
_Architecture: D1 + Postmark (nonprofit/corporate streams) + R2 (NEWSLETTER_BUCKET)_
_Postmark gate: approval expected 2026-04-27 (Monday)_

- **D1 → Postmark subscriber sync** ← NEXT — when a subscriber signs up, add them to the correct Postmark broadcast stream based on `subscriber_topics` series
- **Site publisher** — premium R2 content → published pages + subscriber access URLs
- **Preview subscribers** — send `PREVIEW-XXXXXX` codes to 100 contacts; gate: Postmark approved

### Phase 5: Homepage Redesign + GUI (separate session)
- Homepage redesign, subscriber GUI, visual redesign (blocked on task_ec000004)

### Remaining Queue (in order)
1. **D1 → Postmark subscriber sync** — NEXT
2. **Site publisher** — after sync
3. **Preview subscribers** — after Postmark approval (Monday)
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
- **Postmark APPROVED 2026-04-27** — external sends live. Welcome email format verified (correct From name, copy, unsubscribe link). Bounce from `test@elevationary.com` (non-existent test address, pre-approval) cleared via API. Safe to seed real subscribers.
- **Stripe live keys:** `pk_live_` embedded in `/subscribe/`; restricted `sk_live_` deployed to agent-site2. Live checkout verified (`cs_live_` sessions). Price IDs in `config/stripe-price-ids.json` — do not hardcode.
- **`schema.sql` is now a safe migration** — `CREATE TABLE IF NOT EXISTS` only. For first-time empty-database setup, use `scripts/d1-reset.sql`. Never run `d1-reset.sql` against a live database.
- **Cloudflare AI bot architecture:** "Block AI bots" master switch overrides ALL per-bot AI Crawl Control settings. Current state: master = "Do not block," all AI bots allowed.
- `git filter-branch` was used to rewrite 24 commits — rewritten history already on origin/main. No force pull needed (solo repo).
