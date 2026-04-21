# Backlog

## Blocked on James
These items cannot be automated. Waiting on manual action.

- [ ] **Social Media:** Create Twitter account for `@ElevationaryAI`
- [ ] **FAQ Content:** Review and update FAQ questions in `src/index.njk`
- [ ] **Google Sites Pages:** Create matching About and Legal pages on `elevationary.com` main site
- [ ] **Stripe Webhook Secret:** Configure `STRIPE_WEBHOOK_SECRET` in Cloudflare dashboard to enforce webhook signature verification

## Future Iterations

### Phase 2: Content Pipeline
_Architecture: Cloudflare D1 (subscribers) + Postmark (delivery) + Instantly (outreach). HubSpot removed per ADR-008._

- [ ] **Ingestion Pipeline:** Scripts to fetch and stage newsletter content
- [ ] **Draft Generation:** LLM prompt chain for "3-2-1" and "Full Story" formats
- [ ] **Subscriber Sync:** Cloudflare D1 → Postmark audience sync for broadcast delivery

### ACP/UCP Monitoring
- [ ] Periodically check OpenAI plugin spec and Google agent protocol for updates; document changes in session log

## Icebox
- Community Chat: WhatsApp/Discord integration for subscribers
- Podcast Feed: Auto-generated audio versions of newsletters
- Legacy Migration: Anything remaining from old Google Sites
- Architect Archival Strategy (R2): Implement "Current Year" vs "Archive" split to manage 20k file limit


### Phase 9: Clear Backlog / Solid Foundation (2026-04-20)

### Phase 1: Revenue Engine Foundation

### AI Visibility Layer

### Infrastructure


## Completed
- [X] Git hygiene: committed legacy directive removal + session infrastructure
- [X] `project_state.md` restored and updated to current state
- [X] `legal.njk` enriched with full ToS, Privacy Policy, AI disclaimer
- [X] `about.njk` updated with "What We Do" 3-pillar section
- [X] BACKLOG.md cleaned up — stale refs removed, blocked items separated
- [X] P0: Global Skill Directive — no skills published, nothing to document
- [X] P0: State Sync enforced — `project_state.md` active
- [X] Stripe subscription product and checkout (server-side)
- [X] Cloudflare D1 `subscribers` table deployed
- [X] `subscribe` and `webhook_stripe` Workers deployed and verified
- [X] Freemium gating: `/premium/` → `/unlock/` → Stripe (end-to-end verified)
- [X] Cloudflare environment secrets injected (Stripe, Instantly, Postmark)
- [X] Fix `robots.txt` — allow GPTBot for AI indexing
- [X] GEO Identity: `Organization` schema in `base.njk`
- [X] ACP: `public/.well-known/ai-plugin.json`
- [X] UCP: product catalog manifests
- [X] AEO: `FAQPage` schema on landing pages
- [X] DNS consolidated to Cloudflare (elevationary.com + elevationary.ai) — ADR-004
- [X] Email routing for `@elevationary.ai` → `@elevationary.com` — ADR-005
- [X] HSTS configured
- [X] Consulting product pages: /consulting-15/, /consulting-30/, /consulting-60/, /consulting-90/
- [X] About page (`/about/`)
- [X] Legal page (`/legal/`)
