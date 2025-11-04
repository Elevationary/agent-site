# Decisions (ADRs – lightweight)

## ADR-001 — HSTS scope (2025-10-24)
Decision: Enable HSTS max-age 30d, no includeSubDomains, no preload.  
Why: Reduce risk across subdomains while gaining baseline security.  
Status: Accepted.

## ADR-002 — Agent micro-site strategy (2025-10-24)
Decision: Keep human UX on Google Sites; host agent/AEO pages on Cloudflare Pages with JSON-LD, sitemap, robots.  
Why: Sites blocks <script>, Pages gives control and speed; keeps human UX separate.  
Status: Accepted.

---


# Decisions Log


## 2025-11-03 — Eleventy JSON-LD Smoke Test Completion

**Project Status: COMPLETE** ✅

**Eleventy Build System**
- Stable Eleventy v3.1.x build process with no filter errors
- Centralized product data in `src/_data/products.json` (single source of truth)
- Shared `src/product.njk` template with pagination for all consultation variants
- All 4 consultation pages live: consulting-15, consulting-30, consulting-60, consulting-90

**JSON-LD Structured Data**
- Consistent Product and Offer schema across all consultation pages
- Deterministic fields with no blanks (`@id`, `name`, `description`, `brand`, `image`, `offers`)
- JSON-LD properly injected in HTML head via `head_jsonld` front matter
- All pages validate in Google Rich Results Test

**Sitemap Generation**
- Dynamic sitemap generation from `products.json` data
- All consultation pages included with proper `<lastmod>` timestamps
- Clean URLs with no staging remnants

**Smoke Testing Framework**
- Comprehensive `smoke-test.sh` script with 12 validation tests
- JSON-LD presence and structure validation
- Product data integrity checks (required keys, data types, URL formats)
- Clean pass/fail output with color coding
- Executable via `npm run smoke-test`

**Previous Decisions Maintained**
- Canonical strategy: `https://agent.elevationary.com/<slug>/`
- Cache policy: HTML `must-revalidate`, assets `immutable`
- Security headers and HSTS 30d preserved
- AEO/ACP conventions maintained

## 2025-11-04 — Cloudflare Caching Hygiene

**Cache Policy Implementation**
- **HTML pages**: `Cache-Control: public, max-age=0, must-revalidate`
  - Rationale: Active iteration mode, ensures fresh content delivery
  - Status: ✅ Confirmed working

- **Sitemap**: `Cache-Control: public, max-age=300, must-revalidate`
  - Rationale: Short cache for freshness while allowing edge caching
  - Status: ✅ Confirmed working

- **Assets (/assets/*)**: `Cache-Control: public, max-age=31536000, immutable`
  - Rationale: Long-term caching for static assets (OG images, CSS, JS)
  - Status: ✅ Fixed (was 14400s, now properly 1-year + immutable)

**Implementation Details**
- Cache rules defined in `_headers` file for Cloudflare Pages
- Assets include OG images, stylesheets, and static files
- HTML policy supports rapid development iteration
- Sitemap policy balances freshness with performance

**Verification Commands**
```bash
# Sitemap cache (should be 300s)
curl -sI https://agent.elevationary.com/sitemap.xml | grep -i cache-control

# Assets cache (should be 31536000s + immutable)
curl -sI https://agent.elevationary.com/assets/og-consulting-60.png | grep -i cache-control

# HTML cache (should be 0s + must-revalidate)
curl -sI https://agent.elevationary.com/consulting-60/ | grep -i cache-control
```

## 2025-11-04 — 404 & Redirects Sanity

**404 Page Optimization**
- **Enhanced user experience**: Updated 404.html to display all 4 consultation options instead of single link
- **Consistent branding**: All consultation titles match products.json for brand consistency
- **Complete navigation**: Users see full service menu when hitting missing pages
- **Titles**: 15-Minute AI Strategy Introductory Consultation, 30-Minute AI Readiness Consultation, 60-Minute AI Strategy Consultation, 90-Minute AI Strategy In-depth Consultation

**Redirects Policy**
- **Legacy cleanup**: Removed all `/p/` redirect references from previous staging setup
- **Clean URLs**: Current `/consulting-*/` structure works perfectly without additional redirects
- **Decision**: Skipped optional `_redirects` file for `/slug/index.html` → `/slug/` (no benefit added)
- **Rationale**: Cloudflare Pages handles clean URLs natively; additional complexity unnecessary

**Implementation Details**
- 404.html now provides comprehensive consultation menu
- Product titles centralized in products.json and reflected across site
- No stale redirect rules remaining from previous staging paths
- Clean URL structure maintained without additional redirect files

## 2025-10-27 — Harvest from MiniMVP outline (two files)

**Platform & Hosting**
- Static site architecture with Eleventy (11ty) as the generator — **Accepted (implementation in progress)**
- Deploy on **Cloudflare Pages**; custom domain: `agent.elevationary.com`.

**DNS & TLS**
- Both **elevationary.com** and **elevationary.ai** on **Cloudflare DNS**.
- **SSL/TLS** Cloudflare Full (Strict) for the elevationary.com zone (applies to all proxied hosts: apex, www, agent). Universal SSL (edge cert) covers elevationary.com and *.elevationary.com.
- **HSTS** enabled at 30 days; no subdomains; preload off (revisit later). (Enabled on .com; .ai relies on redirect and does not serve its own content.)

**Redirects**
- **Global `.ai` → `www.elevationary.com`** redirect via Cloudflare Rules, preserving path/query.

**AEO / ACP Conventions**
- Product pages (e.g., `/consulting-60/`) are **index,follow** with constrained previews (Googlebot parity).
- Root catalog (`/`) is **noindex,follow** to avoid human SERP clutter.
- **JSON-LD**: stable `Organization @id`, `Product @id`, `offers.url` points to **Google Booking**, Stripe **Pay Link** exposed via `additionalProperty.paymentLink`.
- Googlebot meta mirrors robots with: noarchive, max-snippet:0, max-image-preview:none.


**Caching & Headers**
- HTML (strategy): target Cache-Control: public, max-age=600
- HTML (current): Cache-Control: public, max-age=0, must-revalidate (temporary to avoid early staleness; revisit when comfortable)
- Assets: Cache-Control: public, max-age=31536000, immutable
- Security: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, minimal Permissions-Policy.


**Verification**
- Search Console (URL-prefix) for `agent.elevationary.com` via **HTML file**; **sitemap** submitted.

**Email Posture**
- `.com`: SPF (Google), DKIM (Google), DMARC `p=none` (CF aggregate reports).
- `.ai`: Cloudflare Email Routing (SPF/DKIM/DMARC for routing) forwarding to `@elevationary.com`.

**Governance**
- Keep **agent** subdomain unlinked from human site (exposure policy).
- Revisit **PR discipline** once base stabilizes.

## ADR-003 — Change control posture (2025-10-24)
Decision: Permit direct-to-main commits during foundation work; re-enable PR discipline when stable.
Why: Speed now, governance later.
Status: Accepted — review in ~1 week.

## ADR-004 — DNS provider consolidation (2025-10-24)
Decision: Move elevationary.com and elevationary.ai authoritative DNS to Cloudflare.
Why: Unified control for Pages, Rules, Email Routing, security posture.
Status: Accepted (completed).

## ADR-005 — Email routing for .ai (2025-10-24)
Decision: Use Cloudflare Email Routing for @elevationary.ai forwarding to @elevationary.com; CF-managed DMARC aggregate.
Why: Simplify forwarding; consistent SPF/DKIM/DMARC posture.
Status: Accepted (completed).

## 2025-10-27 — Commercial & Tracking Defaults

**Product pricing (60‑minute consult)**
- Set price to **$399.00 USD**; review quarterly and align Stripe Pay Link + Calendar price.

**Receipts fallback**
- Add this sentence to Stripe receipt email/template:  
  “If you weren’t redirected to scheduling after payment, book here: https://calendar.app.google/FLe6Q6WzHQkHRK7v7”

**UTM convention for Pay Links**
- Append `?utm_source=site&utm_medium=consulting&utm_campaign=60min` to the 60‑minute Stripe Pay Link.  
- Mirror the pattern for other durations (e.g., `...&utm_campaign=30min`, `...&utm_campaign=90min`) when added.

**AEO/ACP mapping (confirmation)**
- Keep policy: `offers.url` → Google Booking (human flow).  
- Expose Stripe Pay Link for agents/ACP via JSON‑LD `additionalProperty.paymentLink`.
