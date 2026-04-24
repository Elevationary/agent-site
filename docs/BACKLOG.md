# Backlog

## Blocked on James
These items cannot be automated. Waiting on manual action or decision.

- [X] **GSC Sitemap (task_ec140007)** — Submitted 2026-04-24, 7 pages discovered — Phase 1 of Migrate_ElevationaryCom fully closed
- [X] **Stripe Production (task_9f1a2b3c)** — Live keys deployed 2026-04-24; monthly ($19.95) + annual ($199.95) verified working end-to-end
- [ ] **Newsletter handoff format (task_ec000005)** — Decide source + format for content pipeline ingestion (blocks entire Phase 4 build)
- [ ] **elevationary.ai disposition (task_ec000003)** — Redirect to elevationary.com, or build as standalone site?
- [ ] **Elevationary_OS design doc (task_ec000004)** — Required to unlock Phase 2 visual redesign of elevationary.com
- [ ] **Social Media:** Create Twitter account for `@ElevationaryAI`

## Minor Cleanup (Agent-executable, low priority)
- [X] Add `eleventyExcludeFromCollections: true` + `robots: noindex` to empty `product-page.njk` — committed e44921c
- [ ] Delete orphan Cloudflare Pages project `agent-site` (no Git, no custom domain — only `agent-site2` is live)

## Current Sprint — Phase 4: Content Pipeline (agent-site)
_Architecture: Cloudflare D1 (subscribers) + Postmark (delivery) + Instantly (outreach)_
_Blocked on: newsletter handoff format decision (task_ec000005 — James)_

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

### Session 2026-04-24
- [X] GSC sitemap submitted for elevationary.com — Phase 1 closed (task_ec140007)
- [X] Stripe live mode end-to-end — monthly + annual checkout verified (task_9f1a2b3c)
- [X] Dual pricing UI on /unlock/ — monthly ($19.95) and annual ($199.95) cards
- [X] config/products.json + scripts/stripe-sync.js — idempotent Stripe product sync infrastructure
- [X] Cloudflare Pages project naming diagnosed — live project is agent-site2, not agent-site

### Migrate_ElevationaryCom — Phase 1 (2026-04-22)
- [X] D1.1: Scaffold elevationary-main-site (Eleventy 3.1.2, Cloudflare Pages, custom domain)
- [X] D1.2: All 7 content pages populated (index, about, services, contact, legal, newsletter-stories, story-viewer)
- [X] D1.3: SEO/Schema — title tags, meta, OG, canonical, ProfessionalService schema, robots.txt, sitemap.xml, llms.txt, ai-plugin.json
- [X] D1.4: Redirect architecture — 13-rule `_redirects`, www→apex Bulk Redirect, DNS cutover, SSL verified
- [X] D1.5: ORS live verification — all 7 pages 200, all 4 AEO files 200, all redirect rules live
- [X] C1: elevationary.com title — superseded by migration
- [X] C2: "newletter-stories" typo — fixed via `_redirects` 301 rules
- [X] C3: Strategic migration decision — executed

### Phase 2: GEO Enhancement (2026-04-21)
- [X] B1: Cloudflare "Block AI bots" disabled — master switch = Do not block
- [X] B2: Live robots.txt verified clean — AI bots allowed, GPTBot explicit allow
- [X] Enrich Service schema: serviceType, provider, areaServed on all product pages (task_e5f6a0b1)
- [X] Strengthen ai-plugin.json description_for_model with full service catalog + booking intent (task_f6a0b1c2)
- [X] Create /rfp/ landing page with ContactPage + ContactPoint schema (task_a0b1c2d3)
- [X] Add sales ContactPoint to Organization schema linking to /rfp/

### Phase 3: SEO Enhancement (2026-04-21)
- [X] A1–A13: All SEO tasks complete (OG tags, meta descriptions, schema types, sitemap, llms.txt, openapi.yaml, org schema)

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
