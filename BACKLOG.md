Acce# Backlog / Open Decisions

## High Priority
- [ ] Implement 15/30/90 minute consultation variants
- [ ] Set up MailChimp integration for 3-2-1 newsletter
- [ ] Develop automated content generation pipeline for newsletters
- [ ] Implement conversion tracking for bookings and subscriptions
- [ ] Create subscriber-only content pages
- [ ] Set up ACP (Agentic Commerce Protocol) endpoints

## Medium Priority
- [ ] Set up cross-browser and AI browser testing
- [ ] Implement automated testing strategy
- [ ] Implement privacy/cookie consent mechanism
  - [ ] Basic cookie banner with opt-out (MVP)
  - [ ] Full GDPR/CCPA compliance solution (Future)
- [ ] CRM Implementation
  - [ ] **Starter Phase (0-2,000 contacts)**
    - [ ] Mailchimp + Stripe integration
    - [ ] Basic contact management
    - [ ] Email marketing setup
  - [ ] **Growth Phase (2,000+ contacts)**
    - [ ] Evaluate HubSpot Free/Starter
    - [ ] Advanced pipeline tracking
    - [ ] Tool integration assessment

## Future Consideration
- DNSSEC enablement (staged) — Revisit after 1 month of stability
- Newsletter platform evaluation (ConvertKit/Substack/beehiiv) - if MailChimp doesn't meet needs
- **Google Sites SEO Optimization**: Research and document best practices for maximizing SEO within Google Sites' limitations
  - Test and document which meta tags are actually used by search engines
  - Explore if there are any official Google-recommended patterns for structured data
  - Document any workarounds for common SEO needs

## Future Enhancements (When Scaling)
- **Advanced Newsletter Features**
  - A/B testing for subject lines and content
  - Segmentation and personalization
  - Automated email sequences
  - Integration with CRM system
- **Additional Consultation Pages**
  - 15-Minute Consultation Page
  - 30-Minute Consultation Page
  - 90-Minute Consultation Page
  - Custom package builder

# Backlog (Now / Next / Later)


## NOW (Next 1-2 Weeks)
- **Newsletter Implementation**
  - [ ] **Subscription System**
    - [ ] Implement subscription form with validation
    - [ ] Set up double opt-in process
    - [ ] Create welcome email series
    - [ ] Build preference center
    - [ ] Test mobile responsiveness
  - [ ] **Content Management**
    - [ ] Set up content approval workflow
    - [ ] Create newsletter templates
    - [ ] Implement content scheduling
  - [ ] **Analytics & Tracking**
    - [ ] Set up open/click tracking
    - [ ] Implement UTM parameters
    - [ ] Create basic dashboard for key metrics
  - [ ] **Compliance**
    - [ ] Ensure GDPR/CCPA compliance
    - [ ] Set up unsubscribe management
    - [ ] Document data retention policies
  
  - [ ] **Content Generation**
    - [ ] Set up AI content generation pipeline
    - [ ] Implement fact-checking workflow
    - [ ] Create content review process
    - [ ] Set up version control for content
    - [ ] Implement A/B testing framework

  - [ ] **Analytics & Tracking**
    - [ ] Configure Google Analytics 4 events
    - [ ] Set up conversion tracking
    - [ ] Implement UTM parameter strategy
    - [ ] Create dashboard for key metrics

- **Consultation Pages**
  - [ ] Implement 15/30/90 minute variants using the 60-min template
  - [ ] Update `offers.json` with all consultation options
  - [ ] Test booking flow for all time slots

- **3-2-1 Newsletter Implementation**
  - [ ] Create newsletter template structure
    - [ ] Develop HTML/CSS template for email
    - [ ] Design mobile-responsive layout
    - [ ] Create template variants for different editions
  - [ ] Implement subscription management
    - [ ] Build double opt-in flow
    - [ ] Create preference center for subscribers
    - [ ] Set up subscription confirmation emails
  - [ ] MailChimp integration
    - [ ] Configure audience segments
    - [ ] Set up automation workflows
    - [ ] Implement tracking and analytics
  - [ ] Content creation workflow
    - [ ] Develop style guide for 3-2-1 format
    - [ ] Create content templates for each section
    - [ ] Set up editorial calendar

- **AI Content Pipeline**
  - [ ] Research & Curation System
    - [ ] Set up AI-powered content discovery
    - [ ] Implement source validation process
    - [ ] Create database for storing case studies
  - [ ] Content Generation
    - [ ] Develop templates for 3-2-1 components
    - [ ] Create AI prompts for each section
    - [ ] Implement fact-checking workflow
  - [ ] Review & Approval
    - [ ] Set up multi-stage review process
    - [ ] Create feedback collection system
    - [ ] Implement version control for content
  - [ ] Publishing System
    - [ ] Set up automated scheduling
    - [ ] Create multi-channel distribution
    - [ ] Implement A/B testing framework

- **Newsletter Foundation**
  - [ ] Set up MailChimp API integration
  - [ ] Create subscription form component
  - [ ] Design email templates for 3-2-1 format
  - [ ] Implement double opt-in process

- **Analytics & Tracking**
  - [ ] Set up Google Analytics 4 with custom events
  - [ ] Track booking/signup funnels
  - [ ] Monitor page load performance (target: <2s)

- **Testing**
  - [ ] Cross-browser testing matrix
  - [ ] AI browser compatibility (Comet, etc.)
  - [ ] Automated smoke tests for critical paths

- **Dup pages**: 15/30/90 consults using the shared template; verify JSON-LD & sitemap per page.
- **Reviews & ratings schema (optional)**: Decide policy (real reviews only; no fakes). If/when available, add `aggregateRating` and `review` JSON-LD to product pages; wire Eleventy to pull counts/averages from a single source (e.g., `/src/_data/reviews.json`). Include moderation/consent notes.
- **Editorial workflow**: lightweight content pipeline (draft → review → publish); style guide for page copy.
- **PR flow (two-stage)**
  - *Middle-ground (optional, toggle when ready):* one-click PRs on demand; tiny checks (HTML/JSON-LD lint); direct pushes still allowed.
  - *Full discipline (later):* require PRs to `main` with blocking status checks and branch protections.
- **Monitoring**: synthetics (uptime, basic page content), Slack/email alerts.
- **Booking/Stripe**: centralize **price** and **booking** references in `offers.json` (ids/links).
- **Policies**: publish Refund & Cancellation texts and link from booking page(s).
- **Legal**: add ToS / Privacy links on the main site (if missing).
- **Performance budget**: add Lighthouse check (target ≥95 on mobile & desktop) and capture results in `OPS-CHECKS.md`; fix regressions.
- **Twitter meta**: once the @Elevationary handle exists, add `<meta name="twitter:site" content="@Elevationary">` and verify via Twitter card validator.
- **`priceValidUntil` automation**: drive Product `priceValidUntil` from `/src/_data/offers.json` and set a quarterly review reminder.
- **Redirect rule tests**: add curl tests for `.ai → www` 301 with path/query preservation to `OPS-CHECKS.md`.
- **Stripe receipt template:** Add the booking fallback line to the product’s receipt settings. [owner][date]  ￼
- **UTM tagging:** Apply the UTM pattern to the 60-min Pay Link; document for 15/30/90. [owner][date] 

## NEXT (1-3 Months)
- **Advanced Newsletter Features**
  - [ ] **CRM Integration**
    - [ ] Set up Mailchimp audience segments
    - [ ] Configure Stripe payment integration
    - [ ] Implement automated workflows
    - [ ] Set up tagging system
    - [ ] Test email deliverability
  
  - [ ] **Subscriber-Only Portal**
    - [ ] Design authentication system
    - [ ] Implement content protection
    - [ ] Create user dashboard
    - [ ] Set up access control
    - [ ] Test download functionality

  - [ ] **Advanced Analytics**
    - [ ] Implement custom event tracking
    - [ ] Set up conversion funnels
    - [ ] Create retention reports
    - [ ] Monitor engagement metrics
    - [ ] Set up alerts for anomalies

- **Subscriber-Only Content"
  - [ ] Member Portal
    - [ ] Design protected content area
    - [ ] Implement authentication system
    - [ ] Create user profiles and preferences
  - [ ] Content Strategy
    - [ ] Develop content upgrade framework
    - [ ] Create exclusive resources
    - [ ] Set up content drip system
  - [ ] Engagement Tracking
    - [ ] Implement analytics for content consumption
    - [ ] Set up engagement scoring
    - [ ] Create re-engagement workflows

- **Advanced ACP Features**
  - [ ] Implement AI agent authentication
  - [ ] Create API endpoints for agent interactions
  - [ ] Set up monitoring for ACP traffic
  - [ ] Optimize structured data for AI comprehension

- **Performance Optimization**
  - [ ] Implement A/B testing for newsletter formats
  - [ ] Optimize content delivery for global audience
  - [ ] Set up advanced analytics and reporting

- **CRM Integration**
  - [ ] Evaluate if Stripe + MailChimp is sufficient
  - [ ] If needed, implement lightweight CRM (e.g., HubSpot)
  - [ ] Set up lead scoring and nurturing workflows

- **Performance & Security**
  - [ ] Implement Content Security Policy (CSP)
  - [ ] Conduct WCAG 2.1 AA accessibility audit
  - [ ] Set up automated performance monitoring

## FUTURE (3-6+ Months)
- **Newsletter Expansion**
  - [ ] Add specialized newsletter editions
  - [ ] Implement user preference center
  - [ ] Develop content recommendation engine

- **AI Agent Ecosystem**
  - [ ] Create developer portal for ACP
  - [ ] Implement webhook system for real-time updates
  - [ ] Develop agent performance analytics

- **Internationalization**
  - [ ] Multi-language support
  - [ ] Localized pricing and scheduling
  - [ ] Region-specific content adaptation

- **Advanced Features**
  - [ ] Self-service booking portal
  - [ ] Client dashboard for subscription management
  - [ ] Integration with additional payment providers

- **Scaling**
  - [ ] Evaluate need for CDN optimization
  - [ ] Implement advanced caching strategies
  - [ ] Set up automated scaling for traffic spikes

# Backlog — Agent-Site (v2025-10-30)

## Open Decisions (track separately from sprint tasks)
- Newsletter platform choice (ConvertKit/Substack/beehiiv vs. homegrown) — Phase 2.
- Contractor pool model & SLAs — Phase 3.
- DNSSEC enablement (staged) — Revisit after 1 week of stability.

---

## NOW (next 24–48h) — Concrete tickets for production pages

### A. Single source of truth for offers
- [ ] **Create** `/src/_data/offers.json` with this minimal schema (one array of offers):
  ```json
  [
    {
      "key": "consulting60",
      "slug": "consulting-60",
      "title": "60-Minute AI Strategy Consultation",
      "description": "Prepaid AI strategy consultation via Google Meet.",
      "price": "395.00",
      "currency": "USD",
      "image": "/assets/og-consulting-60.png",
      "booking_url": "https://calendar.app.google/FLe6Q6WzHQkHRK7v7",
      "pay_url": "https://buy.stripe.com/3cI8wO9nzcVOffFf98eIw00",
      "indexable": true,
      "show_in_sitemap": true,
      "lastmod": "2025-10-29"
    }
  ]
  ```
- [ ] **Policy**: prices/URLs/images/lastmod must be edited only here; pages derive from data.

### B. Product pages (15 / 30 / 90) using the 60-min as the canonical pattern
- [ ] **Add** `src/consulting-15.md`, `src/consulting-30.md`, `src/consulting-90.md` — each with:
  - `layout: base.njk`
  - `permalink: /<slug>/index.html`
  - `eleventyComputed` pulling `title`, `description`, `og_image`, `robots`, `googlebot`, `canonical`, and `head_jsonld` **from** `offers.json` (match by `slug`).
  - Body: H1 title + two-paragraph description + booking + Stripe links.
- [ ] **Acceptance**: 
  - `curl -sL https://agent.elevationary.com/<slug>/ | tr '\n' ' ' | grep -oiE '<link[^>]+rel=.canonical[^>]*>|<meta[^>]+name=.(description|robots|googlebot).[^>]*>|<meta[^>]+property=.og:image[^>]*>'` shows correct tags.
  - JSON-LD validates in Google Rich Results for all 4 pages (15/30/60/90).

### C. Sitemap sourced from offers.json only
- [ ] **Update** `src/sitemap.njk` to iterate over `collections.all` **or** directly over `offers` data and include **only** items with `indexable && show_in_sitemap`.
- [ ] `<lastmod>`: prefer `offer.lastmod`; fallback to `page.date` when present.
- [ ] **Acceptance**:
  - `curl -sL https://agent.elevationary.com/sitemap.xml` contains only the 15/30/60/90 URLs with correct `<lastmod>`.

### D. Redirects & staging remnants
- [ ] **Ensure** no `_redirects` entries that map `/consulting-*/` → `/p/...` exist (file should be **absent**).
- [ ] **Acceptance**: `curl -i https://<preview>.agent-site2.pages.dev/consulting-60/index.html | sed -n '1,12p'` returns `200` or `308 → /consulting-60/` **not** `/p/…`; `curl -i https://agent.elevationary.com/p/consulting-60/` returns `404`.

### E. Headers & caching policy (no regressions)
- [ ] **HTML**: `Cache-Control: public, max-age=0, must-revalidate`.
- [ ] **Assets**: `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`.
- [ ] **Acceptance**:
  - `curl -sI https://agent.elevationary.com/consulting-60/ | grep -i 'content-type\|cache-control'`
  - `curl -sI https://agent.elevationary.com/assets/og-consulting-60.png | grep -i cache-control`

### F. PR workflow toggle (lightweight)
- [ ] **Add** a note in `README.md` on how to toggle PR-only mode (branch protections & tiny checks) when ready.
- [ ] **Optional**: add a simple CI lint step (HTML/JSON-LD) for PRs; keep direct pushes allowed for now.

---

## NEXT (1–3 days)
- [ ] **Policies**: Publish Refund & Cancellation text and link from all consulting pages.
- [ ] **Cloudflare Web Analytics**: add to base layout; confirm no cookies.
- [ ] **Performance budget**: Lighthouse ≥95 on mobile/desktop; capture scores in `OPS-CHECKS.md`.
- [ ] **Monitoring**: simple synthetic checks for `/` and `/consulting-*/` with Slack/email alerts.
- [ ] **UTM tagging**: document UTM pattern for Pay Links; apply to 15/30/90; capture in `README.md`.
- [ ] **Stripe receipt**: add booking fallback line in Stripe receipt template; note owner/date.
- [ ] **`priceValidUntil` automation**: quarterly review date tracked in repo and surfaced in JSON-LD.

---

## LATER (investment; scale)
- [ ] **Newsletter product**: content pipeline & delivery.
- [ ] **Serverless glue**: CF Workers for webhooks (Stripe/Calendar), CRM/contact handoff.
- [ ] **DNSSEC**: enable per domain; publish DS; validate with DNSViz.
- [ ] **HSTS hardening**: extend `max-age`; consider `includeSubDomains`; evaluate preload.
- [ ] **CSP**: start Report-Only; then enforce with tight `default-src`, `script-src`, `img-src`, `connect-src`.
- [ ] **Accessibility**: WCAG 2.1 AA sweep (contrast/alt/focus/keyboard nav).
- [ ] **Internationalization**: groundwork for language/currency readiness.
- [ ] **Automated DNS snapshots**: monthly CF API export to `/docs/dns-snapshots/`.
- [ ] **Link discovery (optional)**: consider small “Agent catalog” link from main site if crawl discoverability desired; otherwise leave hidden.

---

## AI Content Generation System

### Current Implementation
- **Newsletter Creation Prompt**: Comprehensive prompt for generating 18 unique newsletters (9 non-profit, 9 corporate)
- **3-2-1 Format**: Each newsletter follows the 3-2-1 structure:
  - 3 Practical Stories
  - 2 Actionable Insights
  - 1 Big Question/Call-to-Action
- **Branding**: Uses specific color palette and design guidelines

### Current Challenges
- Manual modifications required for each newsletter
- No tracking of previously published content
- Potential for topic/example duplication
- No built-in workflow management
- No automated source validation

### Proposed Enhancements
1. **Content Database**
   - Track published newsletters
   - Record used sources and examples
   - Store performance metrics
   - Maintain version history

2. **Automated Workflow**
   - Implement workflow management system
   - Create pipeline for content generation
   - Add approval and review steps
   - Schedule and track publishing

3. **AI Agent Improvements**
   - Add memory to track used content
   - Implement topic clustering
   - Create source validation system
   - Add feedback loop for quality improvement

4. **Integration Layer**
   - Connect to MailChimp API
   - Set up webhook notifications
   - Implement analytics tracking

## Cross-references
- Keep `OPS-CHECKS.md` aligned with the acceptance commands above.
- See `DECISIONS.md` for canonical/robots policy and sitemap `lastmod` strategy.
- See `NewsletterDescription.md` for detailed prompt and format specifications.
- See `README.md` Runbook for Eleventy/CF Pages deploy and cache sanity checks.