# Session Handover

_Last updated: 2026-04-27_

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
**Last commit:** `19c15ee` (docs: Postmark approved 2026-04-27)

### Completed this session (2026-04-25/26/27)
- HubSpot fully deprecated — native subscribe form, unsubscribe Worker, confirmation pages
- Postmark welcome email, broadcast streams (`nonprofit`/`corporate`) — **APPROVED 2026-04-27**, external sends live
- Postmark DKIM + Return-Path DNS records added to elevationary.com (Cloudflare)
- Stripe live catalog: 3 products × 6 prices; restricted `sk_live_`; `pk_live_` on /subscribe/
- D1 schema: `subscriber_topics` + `subscriber_events` + `vendors` tables live on remote
- `/subscribe/` — 20-topic checkboxes, optional CC capture; `/unlock/` — 3-tier, `cs_live_` verified
- `/api/setup-intent`, `/api/gate`, `/api/activate` — 4-path premium gating, one-click upgrade
- Preview promo codes: coupon `dTwd1p8S`, 100 `PREVIEW-XXXXXX` codes, `allow_promotion_codes: true`
- **Manifest poller Worker** — hourly cron `0 * * * *`, ORS PASS. Sunday manifest support added. First-run fired; Newsletter Agent notified.
- **Site publisher** — Markdown renderer, `[LINK:]` resolver (D1 vendors), `{{ARCHIVE_URL}}` substitution, YAML stripping, KV write. ORS PASS (end-to-end: Sunday manifest → KV → /insights/ 200)
- **`/insights/[slug]/[date]/`** — paid subscriber gating, KV-served HTML, Cache-Control: private
- KV namespace `PREMIUM_CONTENT` (id: `5e26196157ca450ab036bba33b8d31fa`) — bound to agent-site2 + newsletter-poller
- Cloudflare API token naming convention established: `CLOUDFLARE_API_TOKEN` = wrangler default; `CF_TOKEN_DNS` = DNS-only; `CF_TOKEN_*` pattern for future tokens
- Agent Teams enabled: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json`
- Memory system initialised (4 files); Master Business Plan §9.4 updated
- ORS PASS × 8 — 15+ total findings remediated

### Next — Phase 4 Remaining
_All gates clear. Postmark approved. Preview seeding unblocked._

- **D1 → Postmark subscriber sync** ← NEXT — on subscribe, add subscriber to correct Postmark broadcast stream by `subscriber_topics` series; on unsubscribe, suppress in Postmark
- **Preview subscriber seeding** — send 100 `PREVIEW-XXXXXX` codes to known contacts. Codes at `config/preview-promo-codes.csv` (gitignored, local only). Postmark gate: CLEARED.
- **[LINK:] vendor database** — monitor `newsletter/meta/unresolved-vendors.json` in R2 after first real daily manifest; populate `vendors` D1 table with resolved URLs
- **Newsletter Agent Monday retry** — daily manifest for 2026-04-27 pending (network failure during travel). Will auto-process on next cron tick once in R2.

### Phase 5: Homepage Redesign + GUI (separate session)
- Homepage redesign, subscriber GUI, visual redesign (blocked on task_ec000004)

### Remaining Queue (in order)
1. **D1 → Postmark subscriber sync** — NEXT
2. **Preview subscriber seeding** — UNBLOCKED (send promo codes)
3. **[LINK:] vendor DB** — after first real daily manifest
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
