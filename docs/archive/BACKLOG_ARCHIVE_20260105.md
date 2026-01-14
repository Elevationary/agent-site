Acce# 🚀 NEWSLETTER-FIRST CRITICAL PATH (P1 Priority)

## 🔍 P0: AI AGENT VALIDATION (Week 1 - CRITICAL)
**Business model validation before any infrastructure investment**

### P0.1 - AI Agent Reality Check
**AI Agent Selection & Testing**
- [ ] Test multiple platforms: ChatGPT-4, Claude 3.5, Gemini Advanced
- [ ] Use existing `NEWSLETTERS AGENT CREATION PROMPT.md`
- [ ] Generate 3 complete newsletters: Nonprofit Marketing, Corporate Marketing, Nonprofit Fundraising
- [ ] **Success Criteria**: AI produces publishable content with minimal human editing
- **Impact**: Business model validation | **Effort**: 8-12 hours

**Autonomous Workflow Testing**
- [ ] Can AI agent: Research current events → Find relevant case studies → Generate 3-2-1 format → Maintain brand voice
- [ ] Test repeatability: Generate same newsletter topic 3 times
- [ ] **Success Criteria**: Consistent quality, minimal hallucinations, factual accuracy
- **Impact**: Scalability validation | **Effort**: 6-8 hours

### P0.2 - Go/No-Go Decision
**Quality Assessment Framework**
- [ ] Create scoring rubric for newsletter quality
- [ ] Test with 3-5 industry experts for feedback
- [ ] **Go Criteria**: Average quality score ≥ 8/10, <30 minutes human review per newsletter
- **Impact**: Final business model validation | **Effort**: 4-6 hours

### 🔧 ENABLING INFRASTRUCTURE (Required for Validation)
**From User Items - Integrated into Critical Path**
- [ ] **OpenAI Agentkit Research & Evaluation** - *Item 14* - Investigate as automation platform for newsletter pipeline
- [ ] **AEO/ACP Implementation Audit** - *Item 12* - Ensure AI agents can discover newsletters
- [ ] **AI Bot Scraping Policy Research** - *Item 11* - Protect AI content while allowing AI discovery

---

# Backlog / Open Decisions

## High Priority
- [ ] Implement 15/30/90 minute consultation variants
- [ ] Set up HubSpot integration for newsletter subscription <!-- HubSpot integration prioritised -->
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
- Newsletter platform evaluation (ConvertKit/Substack/beehiiv) - if HubSpot doesn't meet needs
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
    - [ ] Build preference center for subscribers
    - [ ] Set up subscription confirmation emails
  - [ ] HubSpot integration
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

## ✅ COMPLETED (2025-11-03) — Eleventy JSON-LD Smoke Test

### A. ✅ Single source of truth for offers
- [x] **Created** `/src/_data/products.json` with complete schema for all consultation variants
- [x] **Policy**: All prices/URLs/images/lastmod centralized in products.json

### B. ✅ Product pages (15 / 30 / 60 / 90) using shared template
- [x] **Implemented** `src/product.njk` with pagination over products.json
- [x] **All variants live**: consulting-15, consulting-30, consulting-60, consulting-90
- [x] **Acceptance**: All pages validate in Google Rich Results with proper JSON-LD

### C. ✅ Sitemap sourced from products.json
- [x] **Updated** `src/sitemap.njk` to iterate over products data
- [x] **All consultation pages** included with correct `<lastmod>`
- [x] **Acceptance**: Sitemap contains all 4 consultation URLs

### D. ✅ Clean redirects & no staging remnants
- [x] **Removed** all `_redirects` entries and staging paths
- [x] **Acceptance**: No `/p/` redirects, clean URLs

### E. ✅ Headers & caching policy
- [x] **HTML**: `Cache-Control: public, max-age=0, must-revalidate`
- [x] **Assets**: `Cache-Control: public, max-age=31536000, immutable`
- [x] **Acceptance**: All headers verified via OPS-CHECKS

### F. ✅ Comprehensive smoke testing
- [x] **Created** `smoke-test.sh` with JSON-LD validation
- [x] **Tests**: 12 total tests (JSON-LD, product data, URLs)
- [x] **Acceptance**: All tests passing with clean output

### G. ✅ 404 & redirects sanity
- [x] **Updated** 404.html to show all 4 consultation options (15/30/60/90)
- [x] **Fixed** product titles for consistency across site and 404 page
- [x] **Removed** legacy `/p/` redirect references
- [x] **Decision**: Skipped optional `_redirects` file (clean URLs work perfectly)
- [x] **Acceptance**: 404 page provides complete consultation menu with correct titles

### H. ✅ Homepage optimization
- [x] **Identified** root cause: static `/index.html` overriding dynamic template
- [x] **Restored** homepage to original SEO/crawler purpose (not user-facing)
- [x] **Removed** unnecessary product listing cards for cleaner crawler experience
- [x] **Preserved** JSON-LD structured data for SEO, AEO, and ACP
- [x] **Maintained** helpful explanatory text for accidental visitors
- [x] **Decision**: Keep static homepage for simplicity and reliability

### I. ✅ Content polish for consultation pages
- [x] **Enhanced** all 4 consultation pages with differentiated content
- [x] **Standardized** structure: Who It's For, Key Benefits, What You Get, Session Expectations
- [x] **Applied** inclusive language for non-profits and corporations
- [x] **Implemented** above-the-fold summaries with full descriptions below
- [x] **Added** dual CTA placement for better mobile/tablet experience
- [x] **Scaled** promises realistically based on consultation duration
- [x] **Updated** booking links and standardized CTA labels across all products

---

## 📋 USER'S LIST - Items to Process (15 total)

*Temporary holding area - will categorize these items after review*

- [x] **USER ITEM 1** - **Booking URL Monitoring & Correction System** - CRITICAL: Monitor and correct email booking links as any Google Calendar settings changes modify booking URLs, breaking links for pending appointments. Need automated monitoring and update workflow.
- [x] **USER ITEM 2** - **Twitter/X Account Creation & Strategy** - Create @Elevationary Twitter account, optimize for AI search discoverability, determine strategic use case (newsletter promotion, thought leadership, AI insights sharing). Link from website for enhanced AI agent discoverability.
- [x] **USER ITEM 3** - **Email DMARC Configuration** - Review and configure DMARC settings for elevationary.ai via Cloudflare dashboard. Critical for email deliverability and security for newsletter sends and consultation communications. Link: https://dash.cloudflare.com/ef1f0428ea72ee0f92c38067bcba8812/elevationary.ai/email/dmarc-management
- [x] **USER ITEM 4** - **Free CrowdStrike Falcon Go Evaluation** - Amazon Business Prime benefit offering free CrowdStrike cybersecurity access. Investigate if valuable for Elevationary's infrastructure protection, client data security, and compliance requirements. Link: https://elinks.business.amazon.com/CL0/https:%2F%2Fbusiness.amazon.com%2Fen%2Fbusiness-prime%2Fmember-exclusives%2Fcrowdstrike%3Fref_=b2b_adp_e_smb_news_251009/2/01000199e7cfbea9-2eec2a6f-29b0-4e46-8df7-bd6b342c4856-000000/4_lpGhr5tYSEaZqFR02eTp-n9-ditq8VAsfbUizt8Qg=427
- [x] **USER ITEM 5** - **Competitive Tech Stack Analysis** - Review Strategy Breakdowns' open-sourced tech stack for insights applicable to Elevationary. They're a parallel business (newsletter + consulting) with proven success. Evaluate their tools for email, collaboration, social media, productivity, automation, website, finance, design, and sales. Link: https://link.mail.beehiiv.com/ss/c/u001.rYTJ0W7j9a3y5hNx5icsFEcJt38_6jJdgavKkNm_JTvdiwxPtPyJ4z4p1kXku5V7fIQlOwNC-XgA9xpG0EjRQtcC3yZYraOBmXGZ6Y7Tn65l-FNN3d6LmnWUKtgJyphaSyX0m1yfXUPYjnM2XUmsUjF-3jzhpUDjZaIfBQHA3EqZytS96Oqm8r1tuJx5y_6n3Yj9arT0-16MOmin1M8819DJROxCaqgMvDPfu3gz88sMnpGrnyd5e_-c3GIQZJ8s9y0r-7r5MiGvS0fiV--8mA/4kq/jM5v3LZCQAWsoZYrczD88Q/h8/h001.ytgR6Uut-eDcu3W4LuSXJOhJj6o-k_vW0_619x3SXpU
- [x] **USER ITEM 6** - **Stripe Payment Links Optimization** - Explore optional Stripe settings to enhance checkout experience: custom branding, custom domain, additional payment methods, post-payment invoices, URL parameters for tracking. Critical for consultation booking conversion optimization and future newsletter subscription payments. Link: https://58.email.stripe.com/CL0/https:%2F%2Fstripe.com/1/01000199c4942aaf-2c77fe9e-c612-4849-ae69-f610c0d07b17-000000/CExKEGPF7Sroz3-Gog-X7WgZQDsGRKmMmqU2a6UeaGY=426
- [x] **USER ITEM 7** - **Cloudflare Zero Trust Security Enhancement** - Evaluate prescriptive guidance for Zero Trust deployment. Current Free plan has limitations (limited seats, logging, DNS filtering). Consider upgrade to Standard plan for enhanced security, chat/ticket support, and better protection for consultation and newsletter infrastructure. Links: Dashboard, Demos, Docs, Community, Support Specialist, SASE Expert consultation.
- [x] **USER ITEM 8** - **Stripe Billing Advanced Features** - Explore new usage-based billing, flexible pricing models, and enhanced analytics. Critical for newsletter subscription monetization and consultation packaging. Features: custom usage-based pricing, multiple discounts per subscription, detailed billing analytics, revenue optimization tools. Link: https://info-link.stripe.com/MDcyLU1ESy0yODMAAAGd2Z0S5IIxOI3lCl5vokX7EPazbHvKyL-NdWj3JN3_8VsnjPUTCsELMGauevZE3xayiyuMbbE=
- [x] **USER ITEM 9** - **Stripe Checkout A/B Testing & Fast Payouts** - Implement no-code A/B testing for payment methods to optimize conversion rates, enable Instant Bank Payments for lower costs, and configure same-day manual payouts for better cash flow. Critical for consultation booking optimization and newsletter subscription revenue maximization. Link: https://info-link.stripe.com/MDcyLU1ESy0yODMAAAGdz0z4hMLwVRzQ1eFHLDVk15diSQmyJgi7h1uhsNJwYgfPJdB_Wnef8wc17cf1Ys0MnDQ1BqE=
- [x] **USER ITEM 10** - **Google Search Console 'noindex' Tag Issue** - Investigate and fix pages excluded by 'noindex' tag in Google Search Console. Critical for SEO and discoverability of consultation pages and future newsletter landing pages. Check sitemap.xml and individual page meta tags to ensure proper indexing. Link: https://c.gle/APy2Ad33dIfPcss5gUthzwCdyPJkEzOKuSEnTpH4vgtIPAb7Dt61YLWYOxfL3BywcQ9xdpHTqLySQMhFRlvTBQsIOen3kV5Vr0qequzxjZiPLggBMvTZvWdLiopnFxrd4P7w8RDop7ACAIx3u5geE3geXVika3ZmFl21u0Tdff9CGWxbsc6_YyO4jxZvWjhBGmhsrXjz_hP1fri0g1KYhYCttemNUDRyQuzeZyOIsJZ6WW_CgHA0gUSYXR5ERVTuDb2ZRojFAWeHIGRcc5XXNa8kVYz6vYaTdoeUrKvXcbSHA20D4FeSCXLJWmpZQwHvOehATlZFFtbNum9eAO26t7NNde-4jG6y1Y-fCw4
- [x] **USER ITEM 11** - **AI Bot Scraping Policy Research** - Evaluate Cloudflare's one-click AI bot blocking vs. AEO/ACP needs. Research impact on AI agent discoverability, structured data indexing, and search engine optimization. Consider AI Labyrinth mitigation for non-compliant crawlers while allowing legitimate AI agents. Balance content protection with AI search visibility requirements. Links: Block AI Bots, AI Labyrinth, Blog Post
- [x] **USER ITEM 12** - **AEO/ACP Implementation Audit** - Comprehensive review of current design and implementation to ensure AI Engine Optimization (AEO) and Agentic Commerce Protocol (ACP) remain front and center. Verify JSON-LD structured data, semantic HTML, machine-readable content, and AI agent discoverability across consultation pages and future newsletter infrastructure. Critical for AI-powered search and automated agent interactions.
- [x] **USER ITEM 13** - **Google Search Console URL Submission Strategy** - Research and implement automated URL submission to GSC. Unknown frequency requirements, necessity, and impact on crawling. Investigate if manual submission is needed or if sitemap.xml suffices. Critical for consultation pages and future newsletter discoverability. Explore automation options via API or scheduled submissions to GSC.
- [x] **USER ITEM 14** - **OpenAI Agentkit Research & Evaluation** - Investigate OpenAI Agentkit as automation platform competing with Zapier and n8n for newsletter automation. CRITICAL PRIORITY: Must be one of first investigations for newsletter automation pipeline. Evaluate capabilities for AI-driven content generation, scheduling, and distribution workflows. Essential for scaling 18 AI-generated newsletters efficiently.

---

## FUTURE ENHANCEMENTS (Deferred)

### CSS Component System
- [ ] **Minimal CSS component tokens** for product cards
- [ ] **Design system consistency** across consultation pages
- [ ] **Maintainable styling** approach for future updates

### Developer Experience
- [ ] **CLI npm run smoke alias** for shorter smoke test command
- [ ] **Enhanced smoke test output** with better error reporting
- [ ] **Local development tooling** improvements

### CI/CD Automation
- [ ] **GitHub Action to fail PRs** when smoke checks fail
- [ ] **Automated deployment verification** in CI pipeline
- [ ] **Quality gates** for PR-only rule enforcement

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