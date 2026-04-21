# Project State: Elevationary Agent Site
*The Revenue Engine.*

## Current Status
- **Status:** Active
- **Focus:** Establish a low-cost, high-ownership revenue engine ("Lean Stack").
- **Last Updated:** 2026-04-20
- **Archetype:** Platform (Revenue Engine)

## Architecture (Lean Stack — ADR-008)
- **SSG:** Eleventy 3.1.2
- **Edge / Hosting:** Cloudflare Pages + Workers
- **Identity / Revenue:** Stripe (Customer Object + Subscriptions)
- **Subscriber DB:** Cloudflare D1 (`subscribers` table — deployed, active)
- **Outreach:** Instantly.ai (cold lead gen)
- **Delivery:** Postmark (transactional email)
- **HubSpot:** Removed — cost-prohibitive at required tier (ADR-008)

## Recent Accomplishments
- D1 Database (`subscribers`) deployed and active
- `subscribe` and `webhook_stripe` Workers deployed to production
- All API keys (Stripe, Instantly, Postmark) securely injected into Cloudflare
- `subscribe` API verified live (302 Success)
- `about` and `legal` pages created and building
- Freemium gating via Cloudflare Workers (`/premium/` → `/unlock/` → Stripe) — verified end-to-end
- Consulting product pages live: `/consulting-15/`, `/consulting-30/`, `/consulting-60/`, `/consulting-90/`
- ACP (`ai-plugin.json`), UCP manifests, GEO/AEO schemas implemented
- Legacy directive files migrated to fleet level; charter.md and session infrastructure added

## Next Steps
- [ ] Enrich `legal.njk` — full ToS, Privacy Policy, AI disclaimer (in progress this session)
- [ ] Update `about.njk` — add "What We Do" 3-pillar section
- [ ] BACKLOG.md cleanup — remove stale refs, move blocked items
- [ ] Configure Stripe Webhook Secret (manual step — James)
- [ ] Twitter `@ElevationaryAI` account creation (manual step — James)
- [ ] James to update FAQ content in `index.njk`
- [ ] James to create about/legal pages on Google Sites (elevationary.com)

## Known Issues
- **Stripe Webhook:** `STRIPE_WEBHOOK_SECRET` not yet enforced — running in fallback mode until James configures it in Cloudflare dashboard
- **Twitter link:** `@ElevationaryAI` referenced in `about.njk` — account not yet created (blocked on James)

## Blocked on James
- Twitter `@ElevationaryAI` account creation
- Stripe webhook secret configuration
- FAQ content update
- Google Sites about/legal pages
