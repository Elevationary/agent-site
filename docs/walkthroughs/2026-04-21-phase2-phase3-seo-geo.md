# Walkthrough: Phase 2 GEO + Phase 3 SEO Enhancement
**Date:** 2026-04-21 | **Agent:** Claude Code | **Commit range:** 4ed72bb → d8995db

---

## Overview

This session completed two full enhancement sprints against `agent.elevationary.com`:
- **Phase 3 SEO (A1–A13):** 13 technical SEO fixes across templates, schema, sitemap, and content
- **Phase 2 GEO (3 tasks + B1/B2):** AI discoverability layer hardening and Cloudflare bot unblocking
- **Housekeeping:** Notion legacy scripts purged from git history; push to `origin/main` completed

---

## Phase 3 SEO — Task-by-Task

### A1: Remove duplicate OG tags from `base.njk`
**File:** `src/_includes/base.njk`

`base.njk` had a full OG meta block (og:type, og:site_name, og:title, og:description, og:url, og:image) AND included `seo.njk` which outputs the same tags. Every page rendered duplicate OG tags. Removed the OG block from `base.njk` entirely — `seo.njk` is the single owner of OG. Twitter meta tags were left in `base.njk` since `seo.njk` does not emit them.

---

### A2: Fix `og:site_name` to fixed string
**File:** `src/_includes/seo.njk`

`og:site_name` was outputting `{{ _title }}` (the page title), which is semantically wrong — `og:site_name` should be the site brand, not the page title. Changed to the fixed string `"Elevationary Agents"`.

---

### A3: Expand homepage meta description
**File:** `src/index.njk`

Previous description: `"AI consulting micro-site and agent catalog."` (38 characters — well below the 150–160 target). Expanded to: `"Elevationary Agents is the AI service catalog for Elevationary — offering strategic AI consulting sessions, autonomous agent protocols, and machine-readable service manifests for enterprise AI transformation."` (210 characters — rich, keyword-dense, accurate).

---

### A4: Fix `site.json` founder URL backtick typo
**File:** `src/_data/site.json`

The founder URL was: `` "`https://www.elevationary.com/about`" `` — literal backticks wrapped the URL string, breaking the JSON-LD output on every page that included the Organization schema. Fixed to: `"https://www.elevationary.com/about"`.

---

### A5: Remove expired `priceValidUntil`
**File:** `src/_includes/structured-data/product.njk`

`"priceValidUntil": "2025-12-31"` was hardcoded in every product's Offer schema. The date had passed, making all structured data technically invalid. Removed the field entirely — schema validators flag expired `priceValidUntil` as an error.

---

### A6: Change product schema `@type` from `Product` to `Service`
**File:** `src/_includes/structured-data/product.njk`

Consulting sessions and subscriptions are services, not physical or digital products. `Product` is semantically incorrect for schema.org. Changed `@type` to `Service`. Note: `ProfessionalService` extends `LocalBusiness` and is not appropriate for individual service offerings — `Service` is the correct type.

---

### A7: Dynamic sitemap via `collections.all`
**File:** `src/sitemap.njk`

Previous sitemap had hardcoded URLs and hardcoded `lastmod` dates. Rebuilt to iterate `collections.all` (Eleventy's auto-generated collection of all pages), using `page.date` for dynamic `lastmod`. Pages with `robots: noindex` are filtered out. `/product-page/` (empty template file) is also excluded. All indexable pages now appear automatically without manual maintenance.

---

### A8: Add `robots: noindex` to private pages
**Files:** `src/unlock.njk`, `src/subscribe/index.njk`

`/premium/` already had `robots: noindex, nofollow` in frontmatter. Added the same to `/unlock/` and `/subscribe/` — these are transaction/subscription pages that should not appear in search results. The sitemap rebuild in A7 automatically excludes all three.

---

### A9: Enrich product descriptions
**File:** `src/_data/products.json`

All five product descriptions were single-sentence placeholders (under 80 characters). Rewrote each to 150–200 characters with keyword-rich, benefit-forward copy that accurately describes the service scope, methodology (P4D3), and outcome. Also updated `lastmod` dates to `2026-04-21` and fixed `agent-insider` `pay_url` from `"#"` to `"/unlock/"` (A13 overlap).

---

### A10: Create `llms.txt`
**File:** `src/llms.njk` → `/llms.txt`

`llms.txt` is an emerging standard (analogous to `robots.txt`) for helping LLMs understand a site's structure and intent. Created at `/llms.txt` listing all services with URLs, prices, key pages, machine-readable endpoints, and contact info. Built as an Eleventy template so it outputs to `_site/llms.txt` and is served at the root.

---

### A11: Create `openapi.yaml`
**File:** `src/openapi.njk` → `/openapi.yaml`

Created an OpenAPI 3.1.0 specification defining all publicly accessible endpoints: the agent catalog, all product pages, the Stripe webhook, and the sitemap. This is referenced from `ai-plugin.json` and enables AI agents to programmatically discover and interact with the service catalog.

---

### A12: Enrich Organization schema
**File:** `src/_includes/structured-data/organization.njk`

Added to the Organization schema:
- `@type` upgraded from `Organization` to `ProfessionalService`
- `description`: detailed summary of Elevationary's specialization
- `email`: `james.szmak@elevationary.com`
- `areaServed`: `"Worldwide"`
- `knowsAbout`: array of 7 domain expertise strings for AI discoverability
- `contactPoint`: array with customer service and sales (RFP) entries

---

### A13: Fix `agent-insider` `pay_url`
**File:** `src/_data/products.json`

The Agent Insider subscription had `"pay_url": "#"` — a placeholder that would send AI agents and users to a dead link. Changed to `"/unlock/"` which is the correct subscription/payment flow. HubSpot refs in `site.json` were intentionally preserved — `hubspot-form.njk` actively uses them and removing them would break the subscribe and unlock pages.

---

## Phase 2 GEO — Task-by-Task

### B1: Disable Cloudflare AI bot blocking
**Cloudflare dashboard — not a code change**

Cloudflare's "Managed robots.txt" feature was enabled, injecting bot-blocking rules that overrode our `robots.txt` source. Found in: **Protect & Connect → Application security**. Disabled "Managed robots.txt." Then found the master AI bot control: **Configuration → Block AI bots** was set to "Block on all pages" — this overrides all per-bot AI Crawl Control settings. Set to "Do not block."

**Key architecture note:** "Block AI bots" is a master switch. Setting it to "Block on all pages" overrides ALL individual AI Crawl Control per-bot settings. Setting it to "Do not block" resets them all to Allowed. Per-bot AI Crawl Control is only meaningful AFTER the master is set to "Do not block."

---

### B2: Verify `robots.txt` is clean
**Verified live at:** `https://agent.elevationary.com/robots.txt`

Confirmed: `Allow: /` for all agents, GPTBot explicitly allowed, no AI bot Disallow rules, sitemap declared. Cloudflare override is gone.

---

### GEO task_e5f6a0b1: Enrich Service schema on product pages
**File:** `src/_includes/structured-data/product.njk`

Added three new fields to every product's Service schema:
- `serviceType`: `"AI Strategy Consulting"` for consulting products, `"AI Intelligence Subscription"` for the Agent Insider
- `provider`: references the Organization by `@id` — correctly links the service to Elevationary in the knowledge graph
- `areaServed`: `"Worldwide"`

---

### GEO task_f6a0b1c2: Strengthen `ai-plugin.json` `description_for_model`
**File:** `src/.well-known/ai-plugin.json`

Previous `description_for_model`: 85 characters describing a generic "catalog." Rewrote to a 700-character action-oriented description that tells AI agents exactly what to do: which services exist, their prices, when to surface each one (trigger intents: AI consulting, enterprise AI, P4D3, autonomous agents, AI readiness), and that all booking URLs support direct self-service. Also corrected `contact_email` from `support@elevationary.com` to `james.szmak@elevationary.com` and `legal_info_url` to the canonical `/legal/` page.

---

### GEO task_a0b1c2d3: Create `/rfp/` landing page with ContactPoint schema
**File:** `src/rfp.njk`

Created a full RFP landing page at `/rfp/` with:
- What to include in an RFP (6 structured bullet points)
- What Elevationary delivers (Current State Analysis, Future State Goal, Gap Analysis, Roadmap, NTE pricing)
- Direct email contact and fallback consultation links
- `ContactPage` schema with a `ContactPoint` (`contactType: "sales"`) linking to the page
- Sales `ContactPoint` also added to the Organization schema in `organization.njk`

---

## Housekeeping: Git History Cleanup

`legacy_archive/` contained 9 abandoned Notion API scripts from a previous integration. They had never been pushed to GitHub (they were in the unpushed commit queue). GitHub's push protection blocked the push because the Notion API tokens were present in commit `1c3db65`.

Attempted: delete files in a new commit → GitHub still blocked (old commit still in push range with token intact).

Solution: `git filter-branch --index-filter` rewrote all 24 unpushed commits, removing `legacy_archive/` from every commit tree. The original commit containing the token no longer exists. Push succeeded with `--force-with-lease`.

---

## Verification

Build output after all changes: **19 files, 0 errors, 0 warnings** (Eleventy 3.1.2).

Key checks:
- OG tags appear exactly once per page (no duplicates) ✓
- `og:site_name` = `"Elevationary Agents"` on all pages ✓
- Product schema `@type` = `Service`, no `priceValidUntil` ✓
- `/unlock/`, `/subscribe/`, `/premium/` all have `noindex` and are excluded from sitemap ✓
- `/rfp/` appears in sitemap, ContactPage schema valid ✓
- `llms.txt` and `openapi.yaml` served at root ✓
- Live `robots.txt` clean — no AI bot blocks ✓
