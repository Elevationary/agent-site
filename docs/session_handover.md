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
- **task_ec000005**: Newsletter handoff format for content pipeline
- **task_ec000004**: Elevationary_OS design doc for Phase 2 visual design

### Key Lesson — Cloudflare Redirect Loop (2026-04-22)
A pre-existing Single Redirect rule named "Apex → www.elevationary.com" was active in the Cloudflare zone. Combined with our new www→apex Bulk Redirect, this created an infinite 301 loop. Found via **Rules → Trace**. Deleted the Single Redirect rule to resolve. **Before adding any www→apex or apex→www rules to a zone, always run Rules → Trace first to check for conflicting rules.**

---

## Agent Site (agent.elevationary.com)

**Repo:** `/Users/jamesszmak/Antigravity/micro-site/agent-site`
**Last commit:** `1b0d13b` (chore: add R2 binding for gemini-content-factory)

### Completed this session (2026-04-25)
- HubSpot fully deprecated — native subscribe form (`subscribe-form.njk`) replaces embed; `hubspot-form.njk` deleted; HubSpot block removed from `site.json`
- `subscribe.js` updated — From: "Elevationary Thinking <newsletter@elevationary.com>", ReplyTo: replies@elevationary.com, welcome copy finalised, List-Unsubscribe header wired
- `functions/api/unsubscribe.js` — HMAC-SHA256 token verification, D1 status update, redirect to /unsubscribed/
- `/success/` and `/unsubscribed/` confirmation pages added
- `POSTMARK_SERVER_TOKEN` deployed to agent-site2 (production)
- R2 binding `NEWSLETTER_BUCKET` → `gemini-content-factory` added to wrangler.toml
- Newsletter manifest spec agreed with Newsletter Agent — R2 schema v1.0 locked
- Email addresses: newsletter@elevationary.com (sender), replies@elevationary.com (reply-to, Gemini monitors via Gmail)

### Remaining — Phase 4: Content Pipeline (UNBLOCKED)
Architecture: Cloudflare D1 (subscribers) + Postmark (delivery) + R2 (content bus, via NEWSLETTER_BUCKET)
- Postmark 20 audience lists — needs topic roster from Newsletter Agent
- Manifest poller Worker (hourly cron) — R2 → approval check → Postmark send orchestrator
- D1 → Postmark subscriber sync
- Site publisher for premium content
- Preview subscriber promo code (Stripe, 30-day 100% off, 100 contacts)
- UNSUBSCRIBE_SECRET still needed — add to agent-site2 via wrangler pages secret put

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
