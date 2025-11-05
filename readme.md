
# Elevationary – Agent Microsite README

This repo hosts the **agent micro-site** for AEO (Agent Experience Optimization) and ACP (Agentic Commerce Protocol) under `https://agent.elevationary.com`. The public website lives on **Google Sites** at `https://www.elevationary.com`.

## Project Goals

### Primary Objectives
- Provide booking capabilities for AI strategy consultations (15/30/60/90 minute sessions)
- Offer subscription-based 3-2-1 format newsletters with AI applications
- Serve as a lead generation platform for consulting engagements
- Implement Agentic Commerce Protocol (ACP) for AI-native commerce
- Automate content generation and delivery pipeline

### Key Performance Indicators (KPIs)
- **Booking completion rate** vs abandonment rate
- **Subscription completion rate** vs abandonment rate
- Conversion of bookings to consulting projects
- Conversion of newsletter subscribers to bookings/projects
- **ACP Engagement**: AI agent interactions and conversions
- **Content Performance**: Open rates, click-through rates, and engagement metrics

## Agentic Commerce Protocol (ACP)

### Overview
ACP enables AI-native commerce experiences by allowing AI agents to discover, evaluate, and transact on behalf of users. This microsite implements ACP to:
- Make services discoverable by AI agents
- Provide structured data for AI understanding
- Enable seamless booking and subscription flows

### Implementation
- Schema.org markup for services and offers
- Structured data for AI agent comprehension
- API endpoints for agent interactions
- Secure authentication for agent-initiated actions

## 3-2-1 Newsletter Format

### Structure
Each newsletter follows this proven format for maximum engagement and value:

#### 3 Practical Stories
- Real-world examples of AI applications in the newsletter's focus area
- Presented in a table format with concise summaries
- Demonstrates practical implementation and success stories
- Builds credibility by showing real results

#### 2 Actionable Insights
- Practical, immediately applicable strategies
- Specific, step-by-step guidance
- Focused on delivering quick wins
- Often includes templates or frameworks

#### 1 Big Question
- Thought-provoking prompt for reflection
- Connects to broader industry trends
- Encourages reader engagement
- Sparks conversation and deeper thinking

### Example Structure
```
ELEVATIONARY AI: [EDITION NAME]

3 PRACTICAL STORIES
[Case Study 1] - Brief description and key takeaway
[Case Study 2] - Brief description and key takeaway
[Case Study 3] - Brief description and key takeaway

2 ACTIONABLE INSIGHTS
1. [Specific Tip] - Brief explanation and implementation steps
2. [Framework/Strategy] - Clear, actionable guidance

1 BIG QUESTION
[Provocative question that ties back to the theme]
```

### Content Generation Process
1. **AI Research & Curation**
   - Automated gathering of AI trends and case studies
   - Source validation and fact-checking
   - Industry-specific relevance assessment

2. **Content Development**
   - AI-assisted drafting of 3-2-1 components
   - Creation of visual elements (tables, charts)
   - Development of supporting resources

3. **Expert Review**
   - Subject matter expert validation
   - Tone and style refinement
   - Fact verification and source attribution

4. **Approval Workflow**
   - Editorial review for clarity and impact
   - Compliance and brand alignment check
   - Final approval before scheduling

5. **Publishing & Distribution**
   - Automated scheduling through MailChimp
   - Multi-platform optimization (email, web, social)
   - Performance tracking and analytics

### Implementation Guidelines
- Maintain consistent formatting across all editions
- Include clear calls-to-action
- Optimize for both quick scanning and deep reading
- Ensure mobile responsiveness
- Track engagement metrics for continuous improvement

### Newsletter Topics
1. AI in Business Strategy
2. Machine Learning Innovations
3. AI Ethics and Governance
4. Automation and Productivity
5. AI in Marketing
6. Data Science Trends
7. AI in Healthcare
8. Natural Language Processing
9. Computer Vision Applications
10. AI in Finance
11. Robotics and AI
12. Future of Work with AI

---

## Runbook (v0.1)

## Technical Stack

- **Static Site Generator**: Eleventy (11ty) v3.1.x
- **Hosting**: Cloudflare Pages
- **DNS/SSL**: Cloudflare (Full/Strict SSL, HSTS enabled)
- **Analytics**: 
  - Cloudflare Web Analytics (cookie-less)
  - Google Analytics
- **Email Platform**: MailChimp
- **Search**: Google Search Console
- **Schema**: Sitemaps.org, schema.org
- **Booking & Payments**: Google Calendar + Stripe integration

## Current Status (2025-11-03) - ✅ PROJECT COMPLETE

### Infrastructure
- **COMPLETE**: Stable Eleventy v3.1.x build process
- **COMPLETE**: All 4 consultation pages live (15/30/60/90 minutes)
- **COMPLETE**: Centralized product data in `products.json`
- **COMPLETE**: Consistent JSON-LD structured data across all pages
- **COMPLETE**: Comprehensive smoke testing framework (12 tests)
- **COMPLETE**: Dynamic sitemap generation from product data

### Recent Updates
- **COMPLETED**: Eleventy JSON-LD smoke test implementation
- **COMPLETED**: Product page pagination system
- **COMPLETED**: JSON-LD validation and consistency checks
- **COMPLETED**: Clean build process with no filter errors
- **COMPLETED**: All consultation variants deployed and validated
- **COMPLETED**: Enhanced 404 page with complete consultation menu
- **COMPLETED**: Clean URL structure with no legacy redirects
- **COMPLETED**: Optimized homepage for SEO/crawler purpose with minimal UI
- **COMPLETED**: Enhanced consultation page content with standardized structure and inclusive language

## Newsletters

### Documentation Structure
- `NEWSLETTERS.md`: Comprehensive guide to newsletter standards, formats, and processes
- `BACKLOG.md`: Implementation tasks and technical details
- `Agent Newsletter creation Prompt.MD`: AI prompt templates for content generation
- `The 18 Newsletter topics.md`: Complete list of newsletter topics and themes

### 3-2-1 Newsletter Format
Each newsletter follows a structured 3-2-1 format designed to deliver maximum value efficiently:

#### 3 Practical Stories
- Real-world examples of AI application
- Concise case studies with actionable insights
- Focus on measurable outcomes
- Source attribution and key takeaways

#### 2 Actionable Insights
- Practical frameworks and strategies
- Ready-to-implement tips
- Department-specific guidance
- Step-by-step instructions

#### 1 Big Question
- Thought-provoking prompt
- Encourages engagement and reflection
- Ties back to broader business impact
- Includes call-to-action for response

### Newsletter Series

#### 🧡 Nonprofit Series (9 Newsletters)
Focused on mission-driven organizations, covering:
1. **Marketing & Outreach**
   - AI-powered donor segmentation
   - Automated engagement workflows
   - Impact storytelling at scale

2. **Fundraising Campaigns**
   - Predictive donor modeling
   - AI-optimized campaign timing
   - Personalized ask strategies

3. **Donor Stewardship**
   - Automated thank-you sequences
   - Donor journey mapping
   - Impact reporting automation

4. **Volunteer Engagement**
   - Skills matching algorithms
   - Automated scheduling
   - Impact tracking

5. **Program Delivery**
   - Service optimization
   - Resource allocation
   - Outcome measurement

6. **Advocacy & Awareness**
   - Message testing
   - Audience targeting
   - Campaign optimization

7. **Grant Prospecting & Reporting**
   - Grant matching
   - Proposal generation
   - Impact reporting

8. **Impact Measurement**
   - Data collection automation
   - Outcome visualization
   - ROI analysis

9. **Organizational Readiness**
   - AI maturity assessment
   - Change management
   - Capacity building

#### 🏢 Corporate Series (9 Newsletters)
Designed for business growth and efficiency:
1. **Marketing & Demand Generation**
   - Predictive lead scoring
   - Content personalization
   - Campaign optimization

2. **Sales & Revenue Operations**
   - Deal scoring
   - Pipeline forecasting
   - Churn prediction

3. **Customer Success**
   - Health scoring
   - Proactive support
   - Expansion opportunities

4. **Workforce & Partner Enablement**
   - Training automation
   - Knowledge management
   - Performance analytics

5. **Product & Service Delivery**
   - Quality assurance
   - Process optimization
   - Continuous improvement

6. **Brand Influence & Thought Leadership**
   - Content strategy
   - Audience engagement
   - Sentiment analysis

7. **Strategic Partnerships**
   - Partner matching
   - Co-marketing optimization
   - Joint solution development

8. **Business Intelligence & Performance**
   - Predictive analytics
   - KPI forecasting
   - Anomaly detection

9. **Digital Transformation**
   - Roadmap planning
   - Change management
   - ROI measurement

### Implementation Status
- **Current Phase**: Initial rollout
- **Next Milestone**: Complete CRM integration
- **Key Metrics**:
  - Subscription rate (Target: >25% of visitors)
  - Open rate (Target: >35%)
  - Click-through rate (Target: >5%)
  - Conversion to paid (Target: >3% of subscribers)

### Related Documentation
- [Newsletter Creation Process](NEWSLETTERS.md)
- [Implementation Backlog](BACKLOG.md)
- [AI Content Generation](Agent%20Newsletter%20creation%20Prompt.MD)
- [Newsletter Topics](The%2018%20Newsletter%20topics.md)

### Content Management
- Centralized content database
- Version control for all assets
- Performance analytics dashboard
- Automated scheduling and publishing
- Content generation pipeline in development

### 1) Quick Start
```bash
# install (Node 18+ recommended)
npm install

# build static site to ./_site
npm run build

# optional: local dev server
npx @11ty/eleventy --serve
```

- **Eleventy:** v3.1.x  
- **Build output:** `_site/`  
- **Hosting:** Cloudflare Pages `agent-site2` → custom domain `agent.elevationary.com`

---

### 2) Repo Layout (canonical)
```
assets/                      # static assets (passthrough)
_headers                    # CF Pages headers (passthrough)
robots.txt                  # passthrough
sitemap.xml                 # legacy file; output is built from src/sitemap.njk
src/
  _includes/
    base.njk               # base layout (no JSON-LD here)
    seo.njk                # injects canonical/robots/googlebot/canonical
  consulting-60.md         # product page (front matter + markdown)
  index.html               # catalog home (noindex)
  sitemap.njk              # sitemap generator
.eleventy.js                # passthrough + dir config
```
> **Important:** No `_redirects` file is used for `/consulting-60/`. The retired `/p/*` staging path is removed.

---

### 3) Front Matter Contract (page-level SEO)
Pages supply SEO via front matter. **Do not inject JSON-LD from `base.njk`.**

```yaml
---
layout: base.njk
permalink: /<slug>/index.html
title: "<Page Title>"
description: "<Short description>"
canonical: "https://agent.elevationary.com/<slug>/"
robots: "index,follow,noarchive,max-snippet:0,max-image-preview:none,max-video-preview:0"
googlebot: "index,follow,noarchive,max-snippet:0,max-image-preview:none,max-video-preview:0"
og_image: "https://agent.elevationary.com/assets/og-<slug>.png"
lastmod: "YYYY-MM-DD"
head_jsonld: |
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://agent.elevationary.com/<slug>/#product",
    "name": "<Name>",
    "description": "<Short description>",
    "image": ["https://agent.elevationary.com/assets/og-<slug>.png"],
    "brand": {"@type": "Organization", "name": "Elevationary"},
    "url": "https://agent.elevationary.com/<slug>/",
    "offers": {
      "@type": "Offer",
      "price": "395.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://buy.stripe.com/...",
      "seller": {"@type": "Organization", "name": "Elevationary"}
    }
  }
  </script>
---
```

---

### 4) Sanity Checks (copy/paste)
**Headers (content-type / cache)**
```bash
curl -sI https://agent.elevationary.com/consulting-60/ | grep -i 'content-type\|cache-control'
```

**Asset cache policy**
```bash
curl -sI https://agent.elevationary.com/assets/og-consulting-60.png | grep -i cache-control
```

**Canonical / robots / googlebot / OG present**
```bash
curl -sL https://agent.elevationary.com/consulting-60/ \
| tr '\n' ' ' \
| grep -oiE '<link[^>]+rel=.canonical[^>]*>|<meta[^>]+name=.(description|robots|googlebot).[^>]*>|<meta[^>]+property=.og:image[^>]*>' \
|| echo "(head tags not found)"
```

**Sitemap contents + cache header**
```bash
curl -sL https://agent.elevationary.com/sitemap.xml | sed -n '1,40p'
curl -sI  https://agent.elevationary.com/sitemap.xml | grep -i cache-control
```

---

### 5) Deployment Notes (Cloudflare Pages)
- Project: `agent-site2`  
- Build command: `npm run build`  
- Output directory: `_site`
- After a push to `main`, CF Pages deploys automatically to a preview URL and Production.
- **Cache purge:** Site → Configure caching → Custom Purge → URL.

**Robots policy**
- `/` is intentionally `noindex,follow`.
- Product pages (e.g., `/consulting-60/`) are `index,follow`.

**Cache policy**
- HTML: `public, max-age=0, must-revalidate` (active iteration).
- `/assets/*`: `public, max-age=31536000, immutable`.
- `/sitemap.xml`: `public, max-age=300, must-revalidate`.

---

### 6) Known Gotchas / Lessons
- Duplicate `permalink` values cause Eleventy build failures—ensure uniqueness.
- JSON-LD must be page-level. Do **not** put JSON-LD in `base.njk`.
- Retired `/p/*`. Ensure no `_redirects` rules or templates reference `/p/`.
- Do not commit `_site/`.

---

### 7) Adding a New Product (manual, current flow)
Copy `src/consulting-60.md` and update front matter + JSON-LD:
```bash
# example: 90-minute consult
cp src/consulting-60.md src/consulting-90.md
# edit: slug in permalink/canonical, title/description, lastmod, head_jsonld payload
```
Then build and verify:
```bash
npm run build
# run sanity checks in section 4
```

---

### 8) Google Search Console (GSC)
- Property: URL-prefix `https://agent.elevationary.com/`
- Inspect canonical: `https://agent.elevationary.com/consulting-60/`
- Sitemap: `https://agent.elevationary.com/sitemap.xml`
 

## 1) Environment Inventory

**Workstation**
- macOS • Terminal (zsh) • VS Code • Apple Git

**Source Control**
- GitHub: `Elevationary/agent-site` (public)
- Default branch: `main` (branch protection exists; admin can bypass)
- CI/CD: Cloudflare Pages (auto-deploy on push to `main`)
- Secrets/Deploy keys/GitHub Actions: none currently

**Hosting**
- Cloudflare Pages project: **agent-site2**
- Custom domain: `https://agent.elevationary.com`
- Dev alias: `https://agent-site2.pages.dev`

**Primary Web (human site)**
- Google Sites served at `https://www.elevationary.com`
- Apex → Google Sites (via Cloudflare proxy to Google IPs)
- `www` → `ghs.googlehosted.com` (proxied)

**Google Workspace**
- Admin for `@elevationary.com`
- GA4 installed on the Google Site
- Search Console on main site; **agent subdomain verified via HTML file**

**Payments/Scheduling**
- Google Calendar Appointment Schedules (collects payment via Stripe)
- Stripe Pay Link retained in JSON-LD for agent/ACP
- UTM convention for all outbound Pay Links: `?utm_source=site&utm_medium=consulting&utm_campaign=60min`
- Stripe receipt footer note: “If you weren’t redirected, schedule here: https://calendar.app.google/FLe6Q6WzHQkHRK7v7”

**Schema/AEO**
- JSON-LD on agent pages (Organization + Product/Offer)

---

## 2) Domains & DNS (current)

### 2.1 `elevationary.com` (now on Cloudflare DNS)
- Nameservers: **clarissa.ns.cloudflare.com**, **henry.ns.cloudflare.com**
- SSL/TLS (Cloudflare): **Full (Strict)**
- Always Use HTTPS: **On**
- HSTS: **Enabled** — `max-age=2592000` (30 days), `includeSubDomains=Off`, `preload=Off`
- Apex A (proxy on) → Google Sites anycast: `216.239.32.21/34.21/36.21/38.21`
- `www` CNAME (proxy on) → `ghs.googlehosted.com`
- Email (Workspace): MX records present for Google
- SPF: `v=spf1 include:_spf.google.com ~all`
- DKIM: `google._domainkey` TXT **published** (Workspace DKIM)
- DMARC: managed by Cloudflare (monitoring):  
  `v=DMARC1; p=none; rua=mailto:...@dmarc-reports.cloudflare.net,mailto:dmarc@elevationary.com; fo=1; adkim=s; aspf=s; pct=100`

### 2.2 `elevationary.ai` (now on Cloudflare DNS)
- Nameservers: **clarissa.ns.cloudflare.com**, **henry.ns.cloudflare.com**
- Global redirect to main site (preserves path/query):
  - Rule: `*.elevationary.ai/*` → `https://www.elevationary.com/${1}`
  - Rule: `www.elevationary.ai/*` → `https://www.elevationary.com/${1}`
- Email routing (Cloudflare) → forwards to `@elevationary.com`
- MX (Cloudflare routing): `route1/2/3.mx.cloudflare.net`
- SPF (routing): `v=spf1 include:_spf.mx.cloudflare.net ~all`
- DKIM (routing): `cf2024-1._domainkey` TXT present
- DMARC (Cloudflare): `v=DMARC1; p=none; rua=mailto:...@dmarc-reports.cloudflare.net`

---

## 3) Micro-site repo & structure

- Project: **agent-site2** (Cloudflare Pages)
- Auto-deploys on push to `main`
- Custom headers: `/_headers`
/
├─ _headers
├─ 404.html
├─ index.html
├─ robots.txt
├─ sitemap.xml
├─ readme.md
├─ BACKLOG.md
├─ DECISIONS.md
├─ LESSONS.md
├─ OPS-CHECKS.md
├─ googlef8a11de16a66c924.html
├─ assets/
│  ├─ elevationary-logo-512.png
│  ├─ og-consulting-60.png
│  └─ styles.css
├─ consulting-60/
│  └─ index.html
└─ .github/
   └─ pull_request_template.md
   
---

## 4) Security & TLS posture (Cloudflare)

- **SSL/TLS mode**: Full (Strict)  
- **Edge certificate** SANs verified (via `openssl`): `elevationary.com`, `*.elevationary.com`
- **HSTS**: 30-day trial; no subdomains; preload off
- **Always Use HTTPS**: On
- **Headers** (via `/_headers`):
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
  - HTML: `Cache-Control: public, max-age=600` (target)
  - Assets: `Cache-Control: public, max-age=31536000, immutable`
  - `https://agent-site2.pages.dev/*` → `X-Robots-Tag: noindex, nofollow`

> Note: current observed header on `/consulting-60/` is `max-age=0, must-revalidate`. This is acceptable for freshness; we can tighten to 10-minute edge cache later if desired. (intentionally revalidate for now)

---

## 5) AEO / JSON-LD sanity (60-min page)

- `<meta name="robots" content="index,follow">` on `/consulting-60/`
- Organization `@id`: `https://www.elevationary.com/#organization`
- Product `@id`: `https://agent.elevationary.com/consulting-60/#product`
- `offers.url`: Google Booking link
- `additionalProperty.paymentLink`: Stripe Pay Link
- `image`: assets on agent subdomain (not `lh3.googleusercontent...`)
- Canonical: `https://agent.elevationary.com/consulting-60/`
- Root catalog (`/`) is `noindex,follow`

Validators:
- Google Rich Results Test: **OK**
- Schema.org validator: **OK** (no JSON issues)

---

## 6) Search Console (agent subdomain)

- Property: `https://agent.elevationary.com/` (URL-prefix)
- Verification: **HTML file** → `googlef8a11de16a66c924.html`
- Sitemap submitted: `https://agent.elevationary.com/sitemap.xml` (200)

---

## 7) Email deliverability baseline

- **.com**: SPF (Google), DKIM (Workspace) **present**, DMARC (monitoring) via Cloudflare  
- **.ai**: Cloudflare Email Routing active; SPF/DKIM/DMARC set for routing; forwarding to `@elevationary.com` **confirmed working**

---

## 8) Known Nuances / Next reviews

- **DNSSEC**: revisit in ~1 week to enable per-domain (start with `.ai`, then `.com`).
- **PR Discipline**: revisit in ~1 week to enable on every push - once the foundation is stable.
- **HSTS**: consider increasing `max-age` if everything is stable.
- **Branch protection**: current pushes show “admin bypass”; formalize PR workflow if desired.

---

## 9) Change Log

### 2025-10-24 — v2025.10.24

**Infra / DNS / TLS**
- Moved **elevationary.com** and **elevationary.ai** nameservers to **Cloudflare**.
- Proxied apex + `www` for `.com`; `agent.elevationary.com` CNAME → `agent-site2.pages.dev` (proxied).
- TLS mode **Full (Strict)**; **HSTS** enabled (max-age 30d, `includeSubDomains=off`, `preload=off`); **Always Use HTTPS** on.
- `.ai` global redirect: any `*.elevationary.ai` → `https://www.elevationary.com/${1}` (path/query preserved).

**Email / Auth**
- `.ai` email routing via Cloudflare (MX route1/2/3); SPF `include:_spf.mx.cloudflare.net`; DMARC `p=none` (CF aggregate reports).
- `.com` published **Google DKIM** (`google._domainkey`); DMARC managed by CF (`p=none` + aggregate reports).

**Search / AEO**
- Verified **Search Console** property for `https://agent.elevationary.com/`; submitted `sitemap.xml`.

**Site content / headers**
- Added `404.html` and central `assets/styles.css`.
- `_headers`: security (+ `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and caching (HTML 10m; assets 1y immutable); default `*.pages.dev` set to `noindex,nofollow`.
- `consulting-60/`: Twitter card tags + `og:image` dimensions (1200×630); robots/meta aligned for AEO.

---
## Appendix C — Archive harvest (2025-10-24)

The document **“MiniMVP – Full Deployment outline 25.10.17.docx”** was reviewed. Key items were harvested and distributed into working docs:

- **DECISIONS.md**: platform/hosting choices, DNS/TLS posture, AEO/ACP conventions, `.ai` redirect strategy, caching policy, verification approach.
- **BACKLOG.md**: Now/Next/Later backlog across Product & Content, Architecture & Code, Data & Privacy, Reliability & Observability, Payments & Monetization, Legal & Policies, Ops & Support, Growth & GTM, Enterprise-Readiness.
- **LESSONS.md**: operational learnings (Cloudflare cache gotchas, `${1}` capture groups in Redirect Rules, cert/SAN checks with `openssl`, `curl -L`, meta-robots parity with Googlebot, “Proxied” vs “DNS only”).

> Source-of-truth for current state remains this README + the repo. Working docs track decisions, backlog, and lessons over time.





End of README

