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
**Last commit:** `94f5768` (fix: ORS remediation — checkout.js + unlock.njk updated for 3-tier pricing)

### Completed this session (2026-04-25)
- HubSpot fully deprecated — native `subscribe-form.njk`, `hubspot-form.njk` deleted, HubSpot block removed from `site.json`
- `subscribe.js` — From: "Elevationary Thinking <newsletter@elevationary.com>", ReplyTo: replies@elevationary.com, welcome copy, List-Unsubscribe header, D1 fail-hard, Postmark response.ok check
- `functions/api/unsubscribe.js` — HMAC-SHA256 token verification, D1 status update, `?status=invalid` redirect
- `/success/` and `/unsubscribed/` pages (distinct invalid-token message)
- `POSTMARK_SERVER_TOKEN` + `UNSUBSCRIBE_SECRET` deployed to agent-site2
- R2 binding `NEWSLETTER_BUCKET` → `gemini-content-factory` added to wrangler.toml
- Newsletter manifest spec v1.0 locked; ORS test approval no-op convention agreed
- Postmark broadcast streams created: `nonprofit` (topics 1–10) + `corporate` (topics 11–20)
- Stripe migrated to canonical 3-tier structure: Individual Access ($29/$290), Functional Bundle ($69/$690), All-Access Corporate Pass ($149/$1,490) — price IDs in `config/stripe-price-ids.json`
- `checkout.js` updated — 6-key PRICE_IDS map, stale archived IDs removed
- `unlock.njk` stopgap — Tier 1 pricing/plan keys corrected (full 3-tier UI is next sprint)
- Master Business Plan updated — §9.4 HubSpot deprecation + D1 replacement architecture documented
- Memory system initialised — 4 files: HubSpot deprecated, subscription tiers, MBP reference, Cloudflare project names
- ORS PASS × 2 — subscribe/unsubscribe + Stripe migration (4 total findings remediated)

### Active Sprint — Subscription Flow Redesign (IN PROGRESS)
_Critical path: blocks preview subscriber seeding, Phase 4 delivery, and all tier-2/3 revenue_

- D1 schema: add `subscriber_topics` + `subscriber_events` tables
- `/subscribe/` redesign: 20-topic checkboxes (grouped nonprofit/corporate) + optional Stripe SetupIntent CC capture
- `subscribe.js` Worker update: persist topic selections to `subscriber_topics`, handle SetupIntent
- Three-path premium gating: (a) not a subscriber → paywall; (b) free, no CC → Stripe checkout; (c) free, CC on file → one-click activate
- Full 3-tier `unlock.njk` UI (replace Tier 1 stopgap with all three tiers)

### Remaining — Phase 4: Content Pipeline
_Architecture: D1 + Postmark (nonprofit/corporate streams) + R2 (NEWSLETTER_BUCKET)_
- **Manifest poller Worker** — hourly cron, R2 poll, approval check, Postmark send orchestrator; skip "ORS test" approvals; Telegram page on failures + completion
- **D1 → Postmark subscriber sync** — route subscribers to correct stream by topic series
- **Site publisher** — premium R2 content → published pages + subscriber access URLs
- **Preview subscribers** — Stripe promo code (100% off, 30-day) + seed 100 contacts (after subscription flow redesign)

### Phase 5: Homepage Redesign + GUI (separate session)
- Homepage redesign, subscriber GUI (approve/review UI), full visual redesign (blocked on task_ec000004)

### Remaining Queue (in order)
1. **Subscription flow redesign** — IN PROGRESS this session
2. **Phase 4 content pipeline** — manifest poller, subscriber sync, site publisher
3. **Preview subscribers** — Stripe promo + 100 contacts
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
- **Cloudflare AI bot architecture:** "Block AI bots" master switch overrides ALL per-bot AI Crawl Control settings. Current state: master = "Do not block," all AI bots allowed.
- `git filter-branch` was used to rewrite 24 commits — rewritten history already on origin/main. No force pull needed (solo repo).
