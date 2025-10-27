_Last updated: 2025-10-26 (America/Phoenix)_

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

## 2025-10-24 — Harvest from MiniMVP outline

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