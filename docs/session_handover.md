# Session Handover

_Last updated: 2026-04-24 (interim)_

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
**Last commit:** `5474249` (fix: remove debug code, secrets now on correct project)

### Completed this session (2026-04-24)
- GSC sitemap submitted for elevationary.com — 7 pages discovered, Phase 1 closed (task_ec140007)
- Stripe live mode fully operational — monthly ($19.95) and annual ($199.95) checkout verified end-to-end (task_9f1a2b3c)
- Dual pricing UI on `/unlock/` — two cards, two buttons, plan passed server-side
- `config/products.json` + `scripts/stripe-sync.js` — idempotent product sync to Stripe live catalog
- `config/stripe-price-ids.json` — generated price ID manifest for future use

### Next Step (Requires James Decision)
- **Newsletter handoff format (task_ec000005)** — What is the source and format of newsletter content? (RSS / email forward / Google Doc / Notion / file drop). Unblocks entire Phase 4 build.

### Phase 4 Build (ready to start once format decided)
Architecture: Cloudflare D1 (subscribers) + Postmark (delivery)
- Ingestion pipeline: fetch and stage newsletter content
- Draft generation: LLM prompt chain for "3-2-1" and "Full Story" formats
- Subscriber sync: D1 → Postmark audience sync

### Remaining Queue (in order)
1. **Newsletter handoff format** → Phase 4 content pipeline (James decision needed)
2. **elevationary.ai disposition** (task_ec000003) — redirect or standalone?
3. **Twitter @ElevationaryAI** — James creates account
4. **Elevationary_OS design doc** (task_ec000004) — James writes, unblocks Phase 2 redesign

---

## Do Not Re-Try (agent-site)
- Do NOT run `startup.py` or `shutdown.py` — Gemini owns these
- **Cloudflare Pages project name:** The live project is `agent-site2` (has Git + `agent.elevationary.com`). `agent-site` is an orphan with no Git integration. Always run `wrangler pages project list` before any wrangler command.
- Do NOT use `wrangler pages secret put` without first confirming the correct project name via `wrangler pages project list`
- Cloudflare bot blocking is injected by Cloudflare, NOT in robots.txt source — fix requires Cloudflare dashboard
- HubSpot block in `site.json` is still needed — hubspot-form.njk uses it; do not remove
- **Cloudflare AI bot architecture:** "Block AI bots" master switch overrides ALL per-bot AI Crawl Control settings. Current state: master = "Do not block," all AI bots allowed.
- `git filter-branch` was used to rewrite 24 commits — rewritten history already on origin/main. No force pull needed (solo repo).
