# Session Handover

_Last updated: 2026-04-29_

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
**Last commit:** `09b1ccc` (fix: 3 publisher issues from Newsletter Agent round 1 review)

### Completed this session (2026-04-25 → 2026-04-29)
- Full subscriber + payment stack: HubSpot deprecated, Stripe 3-tier live, `/subscribe/` + `/unlock/` ORS'd
- Postmark approved 2026-04-27 — DKIM/Return-Path DNS set, external sends live
- Phase 4 content pipeline complete and ORS'd: manifest poller (hourly cron) + site publisher (KV) + `/insights/` gating
- KV namespace `PREMIUM_CONTENT` (`5e26196157ca450ab036bba33b8d31fa`) bound to agent-site2 + newsletter-poller
- First real daily manifest (2026-04-27): 19/20 topics processed, published to KV, 0 recipients (no subscribers yet)
- Slug format synced with Newsletter Agent — poller uses `topic.topic_slug` from manifest, `/insights/` SLUG_TO_TOPIC map updated
- Publisher fixes from Newsletter Agent v0.01 review: `{{PREMIUM_UPGRADE_URL}}` → `/unlock/`, free email HTML rendered (not `<pre>`), links `target=_blank`
- Vendor DB started: `Antigravity Newsletter` + `Klaviyo` in D1; 37-vendor unresolved list in R2 to populate
- Agent Teams enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`); `wrangler-agent-site` token created; CF token naming convention set
- Memory system initialised (4 files); Master Business Plan §9.4 updated

### Active — Newsletter Review Cycle
James is reviewing newsletter **v0.02** with Newsletter Agent. Agent Site is on standby for any delivery/rendering fixes that come back from James's feedback.

### Next — Phase 4 Remaining
- **D1 → Postmark subscriber sync** ← NEXT BUILD — on subscribe, route subscriber to correct Postmark broadcast stream (`nonprofit`/`corporate`) by topic series; on unsubscribe, suppress
- **Preview subscriber seeding** — James sends 100 `PREVIEW-XXXXXX` codes (in `config/preview-promo-codes.csv`, local only) to known contacts → `agent.elevationary.com/unlock/` → Stripe checkout with code
- **Vendor database** — populate D1 `vendors` table from `newsletter/meta/unresolved-vendors.json` (37 named vendors logged from first daily run)
- **Marketing Agent** — needed before Twitter/social strategy; James deferred `@ElevationaryAI` handle until Marketing Agent defines channel strategy

### Phase 5: Homepage Redesign + GUI (separate session)
- Homepage redesign, subscriber GUI, visual redesign (blocked on task_ec000004)

### Remaining Queue (in order)
1. **Newsletter v0.02 review** — in progress (James + Newsletter Agent)
2. **D1 → Postmark subscriber sync** — agent-executable, building next
3. **Preview subscriber seeding** — James action when ready
4. **Vendor DB population** — ongoing, agent-executable
5. **Homepage redesign + GUI** — separate session
6. **elevationary.ai disposition** (task_ec000003)
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
