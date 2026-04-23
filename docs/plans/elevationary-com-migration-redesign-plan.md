# elevationary.com Migration & Redesign Plan
**Date:** 2026-04-21 | **Status:** Awaiting James Approval

---

## Overview

Two sequential projects:

- **Phase 1 — Pure Migration:** Move `elevationary.com` (and `elevationary.ai`) from Google Sites to Cloudflare Pages, preserving all existing content exactly. Goal: regain full SEO/JSON-LD/schema control. Zero redesign.
- **Phase 2 — Redesign:** Apply Elevationary_OS design system, enrich content for AI-forward positioning, integrate newsletter handoff interface. Gated on Phase 1 completion and Elevationary_OS design doc availability.

Phase 2 (newsletter SaaS content engine) is under separate development by the Newsletter agent and is **not in scope** for Phase 2 here — Phase 2 covers the website redesign only.

---

## Phase 1: Pure Migration

**Effort estimate:** 6–8 agent hours  
**New repo:** `elevationary-main-site` (separate from agent-site)  
**Stack:** Eleventy 3.1.2 + Nunjucks (identical to agent-site)  
**Deployment:** Cloudflare Pages (same pipeline as agent-site)

### Deliverable 1.1 — Repo & Scaffold

- Create `elevationary-main-site` repo under Elevationary org
- Initialize Eleventy with same package.json, .eleventy.js, and base template structure as agent-site
- Set up Cloudflare Pages project connected to new repo
- Configure `elevationary.com` and `elevationary.ai` custom domains in Cloudflare Pages
- Confirm build pipeline is live before any content work begins

### Deliverable 1.2 — Content Extraction & Templates

Pages to migrate (12 total, based on known Google Sites structure):

| Page | URL | Notes |
|---|---|---|
| Home | `/` | Main landing page |
| About | `/about/` | Founder bio, company story |
| Services | `/services/` | Service overview |
| Newsletter Stories | `/newsletter-stories/` | Fixes "newletter-stories" typo (C2) |
| Contact | `/contact/` | RFP/inquiry form |
| Legal / Privacy | `/legal/` | Privacy policy, terms |
| Blog/Articles | `/articles/` | If present — extract all posts |
| _Additional pages_ | TBD | Audit Google Sites for any unlisted pages |

Tasks:
- Manual content extraction from Google Sites (James provides text/images, or agent scrapes via Apify)
- Create one `.njk` template per page type (standard page, article listing, article single)
- Migrate all images to Cloudflare R2 or `public/` folder in repo
- Audit for any remaining pages not in the list above before cutover

### Deliverable 1.3 — SEO Layer

All items blocked on Google Sites — now fully agent-executable:

- `<title>` tags: correct format per page (C1 fix: "Elevationary | AI Strategy & Enterprise Transformation Consulting")
- Meta descriptions: 150–160 chars, keyword-rich
- Open Graph tags (og:title, og:description, og:image, og:url, og:site_name) via seo.njk
- Organization schema (ProfessionalService type, same structure as agent-site organization.njk)
- Individual page schemas: AboutPage, ContactPage, WebPage as appropriate
- `robots.txt`: allow all crawlers including GPTBot
- `sitemap.xml`: dynamic via collections.all (same pattern as agent-site)
- `llms.txt`: LLM discoverability file linking to both `elevationary.com` and `agent.elevationary.com`
- Canonical tags: ensure `elevationary.com` canonicalizes correctly (no `www` vs non-www split)
- `elevationary.ai` → permanent 301 redirect to `elevationary.com` (Cloudflare redirect rule)

### Deliverable 1.4 — Redirect Architecture & DNS Cutover

**Redirects to configure before DNS cutover:**
- All existing Google Sites URLs → new Cloudflare Pages equivalents (301 permanent)
- `www.elevationary.com` → `elevationary.com` (or reverse — pick canonical and redirect the other)
- `elevationary.ai` → `elevationary.com` (Cloudflare redirect rule or Pages redirect)
- `newletter-stories` → `newsletter-stories` (fixes C2 typo permanently at the URL level)

**DNS cutover steps:**
1. Confirm Cloudflare Pages build is clean and all pages verified
2. Update DNS A/CNAME records for `elevationary.com` and `elevationary.ai` to point to Cloudflare Pages
3. Verify SSL certificates issued for both domains
4. Confirm old Google Sites URLs are no longer resolving (or redirect to new site)
5. Submit updated sitemap to Google Search Console

**Risk:** Google Sites may continue serving at the old URL for a period — monitor for duplicate content.

### Deliverable 1.5 — ORS & Verification

ORS protocol (same as agent-site pattern):
- Stage 1: Expected outcome defined (all 12 pages live, all redirects firing, SEO layer verified)
- Stage 2: Build output verified, live URL spot-checks for each page
- Stage 3: Red-team (broken redirects, missing schema, canonical issues, SSL edge cases)
- Stage 4: Remediation of any findings
- Stage 5: Retest and final pass

ORS artifacts: `docs/ORS_logs/elevationary-com-migration.md` (in agent-site repo)

---

## Phase 2: Redesign

**Effort estimate:** 12–18 agent hours  
**Gates:** Phase 1 complete + Elevationary_OS design doc provided by James  
**Scope:** Visual refresh, content enrichment, AI-forward positioning, newsletter handoff interface

### Deliverable 2.1 — Design System Application

- Apply Elevationary_OS design tokens (colors, typography, spacing) to all templates
- Rebuild base.njk with new design system — replace Google Sites visual aesthetic with contemporary AI-forward design
- Responsive layout: ensure mobile, tablet, desktop all render correctly
- Navigation: rebuilt with correct URLs, correct labels (no "newletter-stories" typo), active state highlighting
- Footer: include links to `agent.elevationary.com`, newsletter signup, legal, social
- Design components: hero section, service cards, CTA blocks, testimonial/social proof blocks (if content available)

### Deliverable 2.2 — Content Enrichment

- Homepage: rewrite hero and value proposition to reflect current AI strategy positioning
- About: expand founder bio with P4D3 methodology framing; add company mission statement
- Services: align service descriptions with `agent.elevationary.com` product catalog; cross-link to booking pages
- Newsletter Stories: add subscriber CTA; cross-link to Agent Insider subscription on `agent.elevationary.com`
- FAQPage schema: 8–11 AEO-optimized Q&As (same approach as agent-site FAQ)
- All pages: meta descriptions enriched to 150–160 chars

### Deliverable 2.3 — Advanced SEO & Performance

- Structured data audit: ensure all schemas valid in Google Rich Results Test
- Image optimization: compress and convert to WebP; add width/height attributes; descriptive alt text
- Core Web Vitals: minimize render-blocking resources, lazy-load below-fold images
- Internal linking: `elevationary.com` ↔ `agent.elevationary.com` cross-site links where appropriate
- `ai-plugin.json`: add to elevationary.com (separate from agent-site's version) covering main site services
- `openapi.yaml`: stub spec for elevationary.com public-facing endpoints (contact form, etc.)

### Deliverable 2.4 — Newsletter System Handoff Interface

- `/newsletter/` page on elevationary.com: public-facing newsletter archive/preview
- Subscribe CTA: links to Agent Insider on `agent.elevationary.com/unlock/`
- Newsletter index: auto-generated from R2 storage or D1 (read-only query) — lists past issues
- Individual issue pages: rendered from newsletter content (if agent-readable format available from Newsletter agent)
- Coordination point: Newsletter agent outputs content in a format readable by this Eleventy build (TBD format — likely JSON in R2 or D1)

---

## Decision Points Requiring James Input

| Decision | Phase | Impact |
|---|---|---|
| Canonical domain: `elevationary.com` or `www.elevationary.com`? | 1.4 | Affects all redirects and canonicals |
| Does James extract Google Sites content, or does agent scrape via Apify? | 1.2 | Affects timeline and content fidelity |
| Does `elevationary.ai` become a permanent redirect, or a standalone site? | 1.4 | Affects DNS architecture |
| Elevationary_OS design doc: when available? | 2.1 | Gates Phase 2 start |
| Newsletter handoff format: how does Newsletter agent output content? | 2.4 | Affects Deliverable 2.4 architecture |

---

## P4D3 Task Hierarchy (Proposed)

Once approved, the following will be inserted into P4D3:

```
Elevationary / Operations / Web_Presence / Migrate_ElevationaryCom
├── Phase 1: Pure Migration
│   ├── 1.1 Repo & Scaffold
│   ├── 1.2 Content Extraction & Templates
│   ├── 1.3 SEO Layer
│   ├── 1.4 Redirect Architecture & DNS Cutover
│   └── 1.5 ORS & Verification
└── Phase 2: Redesign
    ├── 2.1 Design System Application
    ├── 2.2 Content Enrichment
    ├── 2.3 Advanced SEO & Performance
    └── 2.4 Newsletter System Handoff Interface
```

Owner split:
- Phase 1 tasks: Agent-executable (except DNS cutover step and any Google Sites content extraction)
- Phase 2 tasks: Agent-executable (except Elevationary_OS design doc provision and newsletter format agreement)
- James-owned: DNS cutover confirmation, design doc provision, canonical domain decision

---

## Open Questions

1. Approve Phase 1 plan as-is, or any scope changes?
2. Canonical domain preference: `elevationary.com` (no www) or `www.elevationary.com`?
3. Content extraction: James provides manually, or agent scrapes Google Sites via Apify?
4. Confirm `elevationary.ai` disposition (permanent redirect vs standalone).
5. When will Elevationary_OS design doc be available to gate Phase 2?
