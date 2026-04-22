# Backlog

## Blocked on James
These items cannot be automated. Waiting on manual action.

- [ ] **C1: elevationary.com title** — Edit Google Sites page title to "Elevationary | AI Strategy & Enterprise Transformation Consulting" (P4D3: task_6d9e0f1a)
- [ ] **C2: Fix "newletter-stories" typo** — Google Sites nav link missing 's' (P4D3: task_7e0f1a2b)
- [ ] **C3: Strategic — Evaluate migrating elevationary.com** from Google Sites to Cloudflare Pages for full SEO/JSON-LD control (P4D3: task_8f1a2b3c)
- [ ] **Social Media:** Create Twitter account for `@ElevationaryAI`
- [ ] **Google Sites Pages:** Create matching About and Legal pages on `elevationary.com` main site
- [ ] **Stripe Production:** Migrate from test key (`sk_test_...`) to live key — re-register webhook endpoint and update Cloudflare secrets
- [ ] **P4D3 hierarchy IDs:** Provide `organization_id`, `portfolio_id`, `program_id`, `project_id` for agent-site Phase 2/3 tasks so Claude Code can mark them complete and add C1/C2/C3/Stripe as new tasks

## Minor Cleanup (Agent-executable, low priority)
- [ ] Add `eleventyExcludeFromCollections: true` + `robots: noindex` to empty `product-page.njk` (ORS carry-forward)

## Current Sprint — Phase 4: Content Pipeline
_Architecture: Cloudflare D1 (subscribers) + Postmark (delivery) + Instantly (outreach)_

- [ ] **Ingestion Pipeline:** Scripts to fetch and stage newsletter content
- [ ] **Draft Generation:** LLM prompt chain for "3-2-1" and "Full Story" formats
- [ ] **Subscriber Sync:** Cloudflare D1 → Postmark audience sync for broadcast delivery

## ACP/UCP Monitoring
- [ ] Periodically check OpenAI plugin spec and Google agent protocol for updates; document changes in session log

## Icebox
- Community Chat: WhatsApp/Discord integration for subscribers
- Podcast Feed: Auto-generated audio versions of newsletters
- Legacy Migration: Anything remaining from old Google Sites
- Architect Archival Strategy (R2): Implement "Current Year" vs "Archive" split to manage 20k file limit

## Completed

### Phase 2: GEO Enhancement (2026-04-21)
- [X] B1: Cloudflare "Block AI bots" disabled — master switch = Do not block
- [X] B2: Live robots.txt verified clean — AI bots allowed, GPTBot explicit allow
- [X] Enrich Service schema: serviceType, provider, areaServed on all product pages (task_e5f6a0b1)
- [X] Strengthen ai-plugin.json description_for_model with full service catalog + booking intent (task_f6a0b1c2)
- [X] Create /rfp/ landing page with ContactPage + ContactPoint schema (task_a0b1c2d3)
- [X] Add sales ContactPoint to Organization schema linking to /rfp/

### Phase 3: SEO Enhancement (2026-04-21)
- [X] A1: Remove duplicate OG tags from base.njk (task_1a2b3c4d)
- [X] A2: Fix og:site_name to fixed string "Elevationary Agents" (task_2b3c4d5e)
- [X] A3: Expand homepage meta description 38 → 160 chars (task_3c4d5e6f)
- [X] A4: Fix site.json founder URL backtick typo (task_4d5e6f0a)
- [X] A5: Remove expired priceValidUntil from product schema (task_5e6f0a1b)
- [X] A6: Change product schema @type Product → Service (task_6f0a1b2c)
- [X] A7: Dynamic sitemap via collections.all — dynamic lastmod, deduped (task_7a0b1c2d)
- [X] A8: Add robots noindex to /unlock/ and /subscribe/ (task_8b1c2d3e)
- [X] A9: Enrich all 5 product descriptions to 150+ chars (task_9c2d3e4f)
- [X] A10: Create llms.txt (task_0d3e4f5a)
- [X] A11: Create openapi.yaml (task_1e4f5a6b)
- [X] A12: Enrich Organization schema (task_2f5a6b7c)
- [X] A13: Fix agent-insider pay_url from "#" to "/unlock/" (task_3a6b7c8d)
- [X] Fix 5 P4D3 task owners from Agent → James (task_4b7c8d9e through task_8f1a2b3c)

### Phase 9: Clear Backlog / Solid Foundation (2026-04-20)
- [X] Git hygiene, project_state.md restored, legal.njk + about.njk enriched, BACKLOG cleanup

### Phase 1: AEO Enhancement (2026-04-20)
- [X] FAQ: 3 placeholders → 11 AEO-optimized Q&As

### Stripe Webhook + P4D3 MCP (2026-04-21)
- [X] Webhook endpoint registered, STRIPE_WEBHOOK_SECRET injected into Cloudflare
- [X] elevationary_p4d3_update_task tool implemented and deployed in Elevationary_OS MCP

### Revenue Engine Foundation
- [X] Stripe subscription + Cloudflare D1 subscribers table
- [X] subscribe and webhook_stripe Workers deployed and verified
- [X] Freemium gating: /premium/ → /unlock/ → Stripe (end-to-end verified)
- [X] Consulting product pages: /consulting-15/ through /consulting-90/

### AI Visibility Layer
- [X] robots.txt — allow GPTBot; Cloudflare AI bot blocking disabled
- [X] Organization schema, ai-plugin.json, UCP manifests, FAQPage schema

### Infrastructure
- [X] DNS consolidated to Cloudflare, HSTS configured
- [X] Notion legacy_archive purged from git history
