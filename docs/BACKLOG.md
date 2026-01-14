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

## 📌 Phase 1: The "Gatekeeper" Implementation (Current Focus)

### Block 1: Foundation & Data Design
- [x] **Project Re-planning**: Update Backlog & Decisions to reflect new strategy.
- [x] **HubSpot Configuration**: Basic Portal/Form ID setup.
- [x] **Env Update**: Upgrade to Node.js v24 (LTS).
- [ ] **HubSpot Schema Definition**: Define the 20 Custom Properties/Lists for subscription groups. (DEFERRED pending discussion)

### Block 2: The "Gatekeeper" Prototype
- [ ] **Create "Locked" Page**: A test page on the microsite that *should* be protected.
- [ ] **Cloudflare Worker Setup**: Initialize a Worker to intercept requests to `/premium/*`.
- [ ] **Auth Logic**: Implement basic check (Cookie -> Allow/Deny).
- [ ] **Redirect Flow**: Users denied access should land on a generic "Subscribe" page.

### Block 3: Stripe <-> HubSpot Wiring
- [ ] **Stripe Product Setup**: Create "Test Product" (Monthly Subscription).
- [ ] **HubSpot Integration**: Configure HubSpot-Stripe app.
- [ ] **Workflow Automation**: Verify that "Stripe Payment" event adds contact to "Active Subscriber" list in HubSpot.

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