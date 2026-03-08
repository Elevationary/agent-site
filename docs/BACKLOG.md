# 🛑 STOP: READ IMMEDIATELY 🛑

> **Protocol Zero:** Before starting any work, you MUST read `directives/Gemini.md`.

# Backlog

## Current Sprint

- [ ] **P0: [Protocol] Review Global Skill Directive.** Read `directives/global_skill_documentation.md` (in Administrator). Ensure any Global Skills you have published are fully documented with a `SKILL.md` manifest.
- [ ] **P0: [Protocol] Enforce State Sync.** `task.md` is for session RAM only. You MUST update `project_state.md` and `BACKLOG.md` before standing down. Use `visualize_org_progress.py` logic as the Source of Truth.

## Future Iterations

### **Focus**: Strengthen website content

- [ ] **Create About Page**: Launch `about` page on `elevationary.com` and `elevationary.ai` (URLs in `site.json`).
- [ ] **Social Media**: Create Twitter account for `@ElevationaryAI` (URL in `site.json`).
- [ ] **Legal Page**: Create `legal` page on `elevationary.com` (referenced in `ai-plugin.json`).
- [ ] **James to Update FAQ content**: Refine the initial FAQ questions in `index.njk`.
- [ ] **James to create about and legal pages on google sites**: Create corresponding pages on `elevationary.com` (main site).
- [ ] **Gemini to monitor google and openai for updated details on UCP and ACP implementations**: Periodically check for spec updates from major AI providers.

### Phase 2 Preview: Content & Production Pipeline

- [ ] **Ingestion Pipeline**: Scripts to fetch content.
- [ ] **Draft Generation**: LLM prompt chain.
- [ ] **HubSpot Integration**: CRM and Email wiring.

## 🔮 Icebox

- **Community Chat**: WhatsApp/Discord integration for subscribers.
- **Podcast Feed**: Auto-generated audio versions of the newsletters.
- **Legacy Migration**: Anything remaining from old Google Sites.
- **Architect Archival Strategy (R2)**: Implement "Current Year" vs "Archive" split to manage 20k file limit.

## Completed

### Phase 1: The Gatekeeper (Revenue Engine)

- [X] **Commerce Infrastructure**
  - [X] Set up Stripe Product (Recurring Subscription)
  - [X] Implement Stripe Checkout (Server-Side)
  - [X] Configure Environment Variables (Cloudflare)
- [X] **Access Control**
  - [X] Create Cloudflare Middleware (`_middleware.js`)
  - [X] Build Unauthorized Redirect Page (`/unlock/`)
  - [X] Verify End-to-End Flow (`/premium/` -> `/unlock/` -> Stripe)

## High Priority (AI Visibility & Commerce)

- [X] **Fix Robots.txt:** Remove `Disallow: /` for `GPTBot` to enable AI indexing.
- [X] **Implement GEO Identity:** Inject `Organization` schema into `base.njk` (Logo, Founder, Socials).
- [X] **Implement ACP:** Create `public/.well-known/ai-plugin.json` for Agentic Commerce.
- [X] **Implement UCP:** Define UCP manifests for product catalog.
- [X] **Implement AEO:** Add `FAQPage` schema to landing pages to capture Featured Snippets.
