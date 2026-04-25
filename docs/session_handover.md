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
**Last commit:** `9c805d7` (fix: ORS remediation — subscribe/unsubscribe hardening)

### Completed this session (2026-04-25)
- HubSpot fully deprecated — native `subscribe-form.njk` replaces embed on `/subscribe/` and `/unlock/`; `hubspot-form.njk` deleted; HubSpot block removed from `site.json`
- `subscribe.js` — From: "Elevationary Thinking <newsletter@elevationary.com>", ReplyTo: replies@elevationary.com, welcome copy final, List-Unsubscribe header, D1 fail-hard, Postmark response.ok check
- `functions/api/unsubscribe.js` — HMAC-SHA256 token verification, D1 status update, `?status=invalid` redirect
- `/success/` and `/unsubscribed/` pages added; `/unsubscribed/` shows distinct message for invalid token
- `POSTMARK_SERVER_TOKEN` + `UNSUBSCRIBE_SECRET` both deployed to agent-site2 (production)
- R2 binding `NEWSLETTER_BUCKET` → `gemini-content-factory` added to wrangler.toml
- Newsletter manifest spec v1.0 locked with Newsletter Agent
- Email addresses: `newsletter@elevationary.com` (sender, Postmark verified), `replies@elevationary.com` (reply-to, Gemini monitors via Gmail)
- ORS PASS — subscribe/unsubscribe + HubSpot removal, log: `docs/ORS_logs/2026-04-25-subscribe-unsubscribe-hubspot-removal.md`

### Remaining — Phase 4: Content Pipeline (UNBLOCKED)
_Architecture: Cloudflare D1 (subscribers) + Postmark (delivery) + R2 (content bus via NEWSLETTER_BUCKET)_
- **Postmark 20 audience lists** — waiting on topic roster from Newsletter Agent (1–10 nonprofit, 11–20 corporate)
- **Manifest poller Worker** — hourly Cloudflare cron, polls R2 for manifests, checks approval record, orchestrates Postmark send; skip `notes` containing "ORS test"
- **D1 → Postmark subscriber sync** — push subscribe/unsubscribe events to correct Postmark list
- **Site publisher** — read premium R2 keys from manifest, publish to site, generate subscriber access URLs
- **Preview subscribers** — Stripe promo code (100% off, 30-day trial) + seed 100 known contacts

### Phase 5: Homepage Redesign + GUI (separate session)
- Homepage (`index.njk`) is currently sparse — needs full landing page redesign
- Subscriber GUI: web-based approve/review UI for newsletter sends
- Full visual redesign: blocked on Elevationary_OS design doc (task_ec000004)
- **P4D3 task to create:** James to insert homepage redesign task with correct project hierarchy IDs

### Remaining Queue (in order)
1. **Phase 4 content pipeline** — start with Postmark audience lists + manifest poller
2. **Preview subscribers** — Stripe promo code + seed 100 contacts
3. **Homepage redesign + GUI** (task_ec000004 gate + separate session)
4. **elevationary.ai disposition** (task_ec000003) — redirect or standalone?
5. **Twitter @ElevationaryAI** — James creates account
6. **Elevationary_OS design doc** (task_ec000004) — James writes, unblocks Phase 2 redesign

---

## Do Not Re-Try (agent-site)
- Do NOT run `startup.py` or `shutdown.py` — Gemini owns these
- **Cloudflare Pages project name:** The live project is `agent-site2` (has Git + `agent.elevationary.com`). `agent-site` is an orphan with no Git integration. Always run `wrangler pages project list` before any wrangler command.
- Do NOT use `wrangler pages secret put` without first confirming the correct project name via `wrangler pages project list`
- Cloudflare bot blocking is injected by Cloudflare, NOT in robots.txt source — fix requires Cloudflare dashboard
- HubSpot is fully deprecated — `hubspot-form.njk` deleted, `site.json` HubSpot block removed. Do not re-add.
- **Cloudflare AI bot architecture:** "Block AI bots" master switch overrides ALL per-bot AI Crawl Control settings. Current state: master = "Do not block," all AI bots allowed.
- `git filter-branch` was used to rewrite 24 commits — rewritten history already on origin/main. No force pull needed (solo repo).
