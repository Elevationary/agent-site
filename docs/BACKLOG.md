# Backlog

## Blocked on James
These items cannot be automated. Waiting on manual action.

- [ ] **B1 (CRITICAL): Cloudflare — Disable AI Scraper Blocking** — **Protect & Connect → Application security** → Bots or Bot Management → disable rules blocking ClaudeBot, GPTBot, Google-Extended, meta-externalagent. If not there, check Delivery & performance. These Cloudflare-injected rules undermine the entire AEO/GEO investment. (P4D3: task_4b7c8d9e)
- [ ] **B2: Verify robots.txt after Cloudflare change** — Confirm AI bots are allowed after B1 is done (P4D3: task_5c8d9e0f)
- [ ] **C1: elevationary.com title** — Edit Google Sites page title to include keywords e.g. "Elevationary | AI Strategy & Enterprise Transformation Consulting" (P4D3: task_6d9e0f1a)
- [ ] **C2: Fix "newletter-stories" typo** — Google Sites nav link has missing 's' (P4D3: task_7e0f1a2b)
- [ ] **C3: Strategic — Evaluate migrating elevationary.com** from Google Sites to Cloudflare Pages for full SEO/JSON-LD control (P4D3: task_8f1a2b3c)
- [ ] **Social Media:** Create Twitter account for `@ElevationaryAI`
- [ ] **Google Sites Pages:** Create matching About and Legal pages on `elevationary.com` main site
- [ ] **Stripe Production:** Migrate from test key (`sk_test_...`) to live key — re-register webhook endpoint and update Cloudflare secrets

## Current Sprint — Phase 2: GEO Enhancement
_Executable by Agent after B1 (Cloudflare bot blocking) is confirmed done by James._

- [ ] Add `Service` schema to all consulting product pages (P4D3: task_e5f6a0b1)
- [ ] Strengthen `ai-plugin.json` `description_for_model` (P4D3: task_f6a0b1c2)
- [ ] Add RFP `ContactPoint` schema and `/rfp/` landing page (P4D3: task_a0b1c2d3)

## Future Iterations

### Phase 4: Content Pipeline
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

## Completed

### Phase 3: SEO Enhancement (2026-04-21)
- [X] A1: Remove duplicate OG meta tags from `base.njk` (seo.njk now owns OG exclusively)
- [X] A2: Fix `og:site_name` to fixed string "Elevationary Agents"
- [X] A3: Expand homepage meta description from 38 → 160 characters
- [X] A4: Fix `site.json` founder URL backtick typo breaking JSON-LD
- [X] A5: Remove expired `priceValidUntil` from product schema
- [X] A6: Change product schema `@type` Product → Service
- [X] A7: Dynamic sitemap via collections.all (dynamic lastmod, no hardcoded dates, deduped)
- [X] A8: Add `robots: noindex` to `/unlock/` and `/subscribe/` (/premium/ already had it)
- [X] A9: Enrich all 5 product descriptions in `products.json` (150+ chars each)
- [X] A10: Create `llms.txt` for LLM/AI discoverability
- [X] A11: Create `openapi.yaml` service specification
- [X] A12: Enrich Organization schema (description, email, knowsAbout, areaServed, contactPoint)
- [X] A13: Fix agent-insider `pay_url` from "#" to "/unlock/"
- [X] Fix 5 P4D3 task owners from "Agent" → "James" (task_4b7c8d9e through task_8f1a2b3c)

### Phase 9: Clear Backlog / Solid Foundation (2026-04-20)
- [X] Git hygiene: committed legacy directive removal + session infrastructure
- [X] `project_state.md` restored and updated to current state
- [X] `legal.njk` enriched with full ToS, Privacy Policy, AI disclaimer
- [X] `about.njk` updated with "What We Do" 3-pillar section
- [X] BACKLOG.md cleaned up — stale refs removed, blocked items separated
- [X] P0: Global Skill Directive — no skills published, nothing to document
- [X] P0: State Sync enforced — `project_state.md` active

### Phase 1: AEO Enhancement (2026-04-20)
- [X] FAQ replaced: 3 placeholders → 11 AEO-optimized Q&As (pricing, duration, geography, post-consultation, retainers, P4D3, Sovereign Dispatcher)

### Stripe Webhook (2026-04-21)
- [X] Webhook endpoint registered against agent.elevationary.com/api/webhook_stripe (Stripe test env)
- [X] `STRIPE_WEBHOOK_SECRET` injected into Cloudflare Pages via Wrangler

### P4D3 MCP Enhancement (2026-04-21)
- [X] `elevationary_p4d3_update_task` tool implemented in Elevationary_OS MCP server
- [X] `p4d3Manager.updateTask()` method added with Zod validation, mutex, cache invalidation
- [X] MCP bundle rebuilt (32.2kb)

### Phase 1: Revenue Engine Foundation
- [X] Stripe subscription product and checkout (server-side)
- [X] Cloudflare D1 `subscribers` table deployed
- [X] `subscribe` and `webhook_stripe` Workers deployed and verified
- [X] Freemium gating: `/premium/` → `/unlock/` → Stripe (end-to-end verified)
- [X] Cloudflare environment secrets injected (Stripe, Instantly, Postmark)

### AI Visibility Layer
- [X] Fix `robots.txt` — allow GPTBot for AI indexing
- [X] GEO Identity: `Organization` schema in `base.njk`
- [X] ACP: `public/.well-known/ai-plugin.json`
- [X] UCP: product catalog manifests
- [X] AEO: `FAQPage` schema on landing pages

### Infrastructure
- [X] DNS consolidated to Cloudflare (elevationary.com + elevationary.ai) — ADR-004
- [X] Email routing for `@elevationary.ai` → `@elevationary.com` — ADR-005
- [X] HSTS configured
- [X] Consulting product pages: /consulting-15/, /consulting-30/, /consulting-60/, /consulting-90/
- [X] About page (`/about/`)
- [X] Legal page (`/legal/`)
