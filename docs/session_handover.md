# Session Handover

**Task:** Phase 2 GEO Enhancement (remaining tasks)
**Status:** Phase 3 SEO complete and committed. Phase 2 blocked on B1 (James: Cloudflare bot unblock).

**Last Action:**
- Completed all 13 Phase 3 SEO tasks (A1–A13): duplicate OG tags removed, og:site_name fixed, homepage description expanded, founder URL typo fixed, product schema updated (Service type, priceValidUntil removed), sitemap made dynamic via collections.all, noindex added to private pages, product descriptions enriched, llms.txt and openapi.yaml created, Organization schema enriched, agent-insider pay_url fixed
- Fixed 5 P4D3 task owners from "Agent" → "James" (task_4b7c8d9e through task_8f1a2b3c)
- All committed: `631de08` — clean build (18 files, 0 errors)

**Next Step:**
1. **James: B1** — Cloudflare dashboard → Security → Bots → disable AI scraper blocking (ClaudeBot, GPTBot, Google-Extended blocked by Cloudflare)
2. After B1 confirmed: **B2** — Verify robots.txt shows AI bots allowed
3. **Execute Phase 2 GEO tasks** (after B1):
   - Add `Service` schema to all consulting product pages (task_e5f6a0b1)
   - Strengthen `ai-plugin.json` `description_for_model` (task_f6a0b1c2)
   - Add RFP `ContactPoint` schema and `/rfp/` landing page (task_a0b1c2d3)
4. **Consider git push** — 19 commits ahead of origin/main; push when ready to deploy

**Do Not Re-Try:**
- Do NOT run `startup.py` or `shutdown.py` — Gemini owns these
- Do NOT use `wrangler secret put` without confirming the secret value first
- The Cloudflare bot blocking is injected by Cloudflare, NOT in our robots.txt source — fixing requires Cloudflare dashboard
- HubSpot block in `site.json` is still needed — hubspot-form.njk uses it; do not remove

**Open Questions:**
- Should elevationary.com migrate from Google Sites to Cloudflare Pages? (C3 — strategic decision for James)
- Stripe test vs. live key: webhook and secrets are all in test env — needs live key migration when ready for production
- A13 partial: HubSpot refs in site.json were intentionally preserved (still in use). Only pay_url was fixed.
