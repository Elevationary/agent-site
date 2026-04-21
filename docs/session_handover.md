# Session Handover

**Task:** Phase 4 Content Pipeline (next sprint) or C1/C2/C3 elevationary.com fixes
**Status:** Phase 2 GEO + Phase 3 SEO both complete. All A/B tasks done. Only C-tasks (Google Sites) and Stripe production remain as blockers requiring James.

**Last Action:**
- Phase 2 GEO complete: Service schema enriched (serviceType, provider, areaServed), ai-plugin.json strengthened, /rfp/ page created with ContactPage + ContactPoint schema, Organization schema updated with sales ContactPoint
- B1/B2 complete: Cloudflare "Block AI bots" disabled (master switch = Do not block), all AI crawlers now allowed, robots.txt verified clean
- Committed: `de539e9` — clean build (19 files, 0 errors)
- 21 commits ahead of origin/main — push when ready to deploy

**Next Step (Agent-executable, no James input needed):**
- Phase 4 Content Pipeline: Cloudflare D1 → Postmark subscriber sync, newsletter ingestion scripts, draft generation chain
- OR: Any Phase 2/3 follow-up refinements James requests

**Next Step (Requires James):**
- **C1:** elevationary.com Google Sites title fix
- **C2:** Fix "newletter-stories" nav typo on Google Sites
- **C3:** Strategic decision — migrate elevationary.com to Cloudflare Pages?
- **Stripe:** Migrate from test key to live key when ready for production
- **Git push:** 21 commits ahead of origin/main — `git push` to deploy to Cloudflare Pages

**Do Not Re-Try:**
- Do NOT run `startup.py` or `shutdown.py` — Gemini owns these
- Do NOT use `wrangler secret put` without confirming the secret value first
- Cloudflare bot blocking is injected by Cloudflare, NOT in robots.txt source — fix requires Cloudflare dashboard
- HubSpot block in `site.json` is still needed — hubspot-form.njk uses it; do not remove
- **Cloudflare AI bot architecture:** "Block AI bots" master switch overrides ALL per-bot AI Crawl Control settings. Current state: master = "Do not block," all AI bots allowed. To block only training scrapers (CCBot), use per-bot AI Crawl Control individually — do NOT touch the master switch.

**Open Questions:**
- Should elevationary.com migrate from Google Sites to Cloudflare Pages? (C3 — strategic decision for James)
- Stripe test vs. live key: webhook and secrets are all in test env — needs live key migration when ready for production
