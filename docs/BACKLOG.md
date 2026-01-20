# Product Backlog

## High Priority (AI Visibility & Commerce)
- [x] **Fix Robots.txt:** Remove `Disallow: /` for `GPTBot` to enable AI indexing.
- [x] **Implement GEO Identity:** Inject `Organization` schema into `base.njk` (Logo, Founder, Socials).
- [x] **Implement ACP:** Create `public/.well-known/ai-plugin.json` for Agentic Commerce.
- [x] **Implement UCP:** Define UCP manifests for product catalog.
- [x] **Implement AEO:** Add `FAQPage` schema to landing pages to capture Featured Snippets.

## General Backlog
**Focus**: Freemium Newsletter Platform (HubSpot + Stripe + Cloudflare)

- [ ] **Create About Page**: Launch `about` page on `elevationary.com` and `elevationary.ai` (URLs in `site.json`).
- [ ] **Social Media**: Create Twitter account for `@ElevationaryAI` (URL in `site.json`).
- [ ] **Legal Page**: Create `legal` page on `elevationary.com` (referenced in `ai-plugin.json`).
- [ ] **James to Update FAQ content**: Refine the initial FAQ questions in `index.njk`.
- [ ] **James to create about and legal pages on google sites**: Create corresponding pages on `elevationary.com` (main site).
- [ ] **Gemini to monitor google and openai for updated details on UCP and ACP implementations**: Periodically check for spec updates from major AI providers.
### Phase 1: The Gatekeeper (Revenue Engine)
- [x] **Commerce Infrastructure**
    - [x] Set up Stripe Product (Recurring Subscription)
    - [x] Implement Stripe Checkout (Server-Side)
    - [x] Configure Environment Variables (Cloudflare)
- [x] **Access Control**
    - [x] Create Cloudflare Middleware (`_middleware.js`)
    - [x] Build Unauthorized Redirect Page (`/unlock/`)
    - [x] Verify End-to-End Flow (`/premium/` -> `/unlock/` -> Stripe)

### Phase 2 Preview: Content & Production Pipeline
- [ ] **Ingestion Pipeline**: Scripts to fetch content.
- [ ] **Draft Generation**: LLM prompt chain.
- [ ] **HubSpot Integration**: CRM and Email wiring.

### Block 4: Content Templates
- [ ] **"3-2-1" Template (Free)**: Layout for the public summary version.
- [ ] **"Full Story" Template (Paid)**: Deep-dive layout with "Expert Analysis" sections.
- [ ] **Unlock/Upgrade Landing Page**: The destination for non-subscribers (Pricing cards, Bundle options).

---

## 🚀 Phase 2: Content & Production Pipeline

### Automated Content Generation
- [ ] **Ingestion Pipeline**: Scripts to fetch "Top AI News" from sources.
- [ ] **Draft Generation**: LLM prompt chain to output "3-2-1" draft format.
- [ ] **Review Interface**: Simple way for human editor to approve/tweak drafts before publishing.

### Distribution
- [ ] **Email Template Sync**: styling the HubSpot email drag-and-drop template to match the site.
- [ ] **Archive Page**: Automated index of past newsletters on the microsite.

---

## 🔮 Future / Deep Freeze
- **Community Chat**: WhatsApp/Discord integration for subscribers.
- **Podcast Feed**: Auto-generated audio versions of the newsletters.
- **Legacy Migration**: Anything remaining from old Google Sites.
- **Architect Archival Strategy (R2)**: Implement "Current Year" vs "Archive" split to manage 20k file limit.