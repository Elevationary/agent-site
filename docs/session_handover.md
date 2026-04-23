# Session Handover

_Last updated: 2026-04-22_

---

## Active Project: Migrate_ElevationaryCom (elevationary-main-site)

**Repo:** `/Users/jamesszmak/Antigravity/micro-site/elevationary-main-site`
**Deployed:** Cloudflare Pages → `elevationary.com` (live, DNS cutover complete 2026-04-22)

**Phase 1 Status:** D1.1–D1.5 complete. One task remains for James before Phase 1 is fully closed.

### Completed this session (2026-04-22)
- D1.1: Scaffold (Eleventy 3.1.2, Cloudflare Pages, custom domain)
- D1.2: All 7 content pages populated from Apify scrape (index, about, services, contact, legal, newsletter-stories, story-viewer)
- D1.3: SEO/Schema verification — title tags, meta, OG, canonical, ProfessionalService schema, robots.txt, sitemap.xml, llms.txt, ai-plugin.json (all 10 tasks Completed in P4D3)
- D1.4: Redirect architecture — `_redirects` file (13 rules), www→apex Bulk Redirect in Cloudflare, DNS cutover, SSL verified (tasks ec140001–ec140006 Completed)
- D1.5: ORS live verification — all 7 pages 200, all 4 AEO files 200, all redirect rules verified on live domain

### Remaining — James-owned
- **task_ec140007**: Submit `https://elevationary.com/sitemap.xml` to Google Search Console → closes Phase 1

### Phase 2 Gate (blocked)
- Requires: Elevationary_OS design doc from James (task_ec000004)
- Requires: Phase 1 fully closed (pending GSC only)

### Open Decisions (James)
- **task_ec000003**: elevationary.ai — redirect to elevationary.com, or standalone site?
- **task_ec000005**: Newsletter handoff format for content pipeline
- **task_ec000004**: Elevationary_OS design doc for Phase 2 visual design

### Key Lesson — Cloudflare Redirect Loop (2026-04-22)
A pre-existing Single Redirect rule named "Apex → www.elevationary.com" was active in the Cloudflare zone. Combined with our new www→apex Bulk Redirect, this created an infinite 301 loop. Found via **Rules → Trace**. Deleted the Single Redirect rule to resolve. **Before adding any www→apex or apex→www rules to a zone, always run Rules → Trace first to check for conflicting rules.**

---

## Agent Site (agent.elevationary.com)

**Repo:** `/Users/jamesszmak/Antigravity/micro-site/agent-site`
**Last commit:** `4ed72bb` (interim session handover + backlog update)

### Next Step (Agent-executable)
1. Fix `product-page.njk` ORS carry-forward: add `eleventyExcludeFromCollections: true` + `robots: noindex` (2 min)
2. Phase 4: Content pipeline — D1 → Postmark sync, newsletter ingestion, draft generation (blocked on task_ec000005 newsletter handoff format decision)

### Next Step (Requires James)
- Stripe: Migrate test keys to live keys (task_9f1a2b3c)

---

## Do Not Re-Try (agent-site)
- Do NOT run `startup.py` or `shutdown.py` — Gemini owns these
- Do NOT use `wrangler secret put` without confirming the secret value first
- Cloudflare bot blocking is injected by Cloudflare, NOT in robots.txt source — fix requires Cloudflare dashboard
- HubSpot block in `site.json` is still needed — hubspot-form.njk uses it; do not remove
- **Cloudflare AI bot architecture:** "Block AI bots" master switch overrides ALL per-bot AI Crawl Control settings. Current state: master = "Do not block," all AI bots allowed. Per-bot controls only work after master is "Do not block."
- `git filter-branch` was used to rewrite 24 commits — rewritten history already on origin/main. No force pull needed (solo repo).
