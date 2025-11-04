# Lessons Learned

## Quick hits
- **Cloudflare cache**: Pages can serve stale HTML for a few minutes after meta/header edits. Purge **by URL** for the edited page and any referenced assets, or version the asset filename. Expect a brief edge lag.
- **Keep agent human‑hidden**: Do **not** link the agent subdomain from the public site to avoid audience/UX bleed.
- **Redirect rules placeholders**: In Cloudflare Redirect Rules, use **`${1}`** capture placeholders (not `$1`) when preserving path/query.
- **Testing redirects/canonicals**: Prefer `curl -sIL` and **quote URLs with `?`** to avoid shell globbing in zsh.
- **Robots parity**: Keep `<meta name="robots">` and `<meta name="googlebot">` consistent.
  - **Product page**: `index,follow,noarchive,max-snippet:0,max-image-preview:none`
  - **Catalog root**: `noindex,follow`
- **TLS certificates**: Cloudflare’s cert applies **only** to **Proxied** DNS records; **DNS only** hosts present the origin’s cert.
- **HSTS posture**: Start with **30 days**, **includeSubDomains = off**, **preload = off**. Expand only after confirming TLS across needed hostnames.
- **Search Console**: Use URL‑prefix + **HTML file** verification for the agent subdomain; re‑verify after major hosting/header/domain changes.

## 2025-10-24 — From MiniMVP + cutovers

### Cloudflare cache behavior
- HTML may remain stale briefly even after deployment. Use **Purge by URL** for the exact page and its assets, or bump asset versions.

### Redirect rules syntax
- Zone‑wide `.ai → .com` redirect should match on host and **preserve path + query**.
- Use capture groups with curly‑brace placeholders: **`${1}`, `${2}` …**, not `$1`.

### TLS & certificate checks
- “**Proxied**” vs “**DNS only**” determines which certificate browsers see (Cloudflare vs origin).
- To quickly confirm SAN coverage:

```bash
# www certificate SANs
openssl s_client -connect www.elevationary.com:443 -servername www.elevationary.com 2>/dev/null | \
openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'

# apex certificate SANs (visible even if it 301s)
openssl s_client -connect elevationary.com:443 -servername elevationary.com 2>/dev/null | \
openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'
```

### curl tips
- Use `-L` to follow redirects and `-I` for headers.
- Always **quote** URLs that include `?` (e.g., `curl -I "https://example.com/abc?x=1"`).

### Robots meta alignment
- Keep `robots` and `googlebot` meta tags aligned per Quick hits above.

### Search Console verification
- URL‑prefix + HTML file is simple and robust for subdomains; re‑verify after domain/hosting/header changes.

### HSTS baseline
- Begin with 30‑day max‑age, **no** subdomains, **no** preload; only expand scope after confirming TLS readiness across hostnames.

## 2025-11-03 — Eleventy JSON-LD Smoke Test Completion

### Project Achievement
- **Stable build process**: Eleventy v3.1.x with no filter or syntax errors
- **Centralized product data**: Single source of truth in `products.json`
- **Consistent JSON-LD**: All consultation pages have proper structured data
- **Comprehensive testing**: 12-test smoke test suite with clean output

### Key Technical Solutions
1) **Pagination-based product pages**: Implemented `src/product.njk` with Eleventy pagination over `products.json`, eliminating duplicate permalink issues
2) **Proper JSON-LD injection**: Moved structured data to `head_jsonld` front matter variable, ensuring it appears in HTML head section
3) **Deterministic field handling**: Ensured all JSON-LD fields are consistently populated with no blank values
4) **Robust smoke testing**: Created comprehensive validation script using `jq`, `grep`, and `sed` for JSON-LD and product data integrity

### Smoke Testing Framework
- **JSON-LD validation**: Checks for presence, syntax, and required Product/Offer fields
- **Product data validation**: Verifies required keys, data types, and URL formats
- **Special field handling**: Proper `jq` syntax for fields with `@` symbols (`@context`, `@type`, `@id`)
- **Clean output**: Color-coded pass/fail results with no debug noise

### Previous Issues Resolved
- ✅ Duplicate permalink conflicts eliminated
- ✅ JSON-LD properly scoped to product pages only
- ✅ All staging redirects removed
- ✅ Cache policies correctly implemented
- ✅ Sitemap dynamically generated from product data

### 404 & Redirects Optimization
- **Enhanced 404 experience**: Show all service options instead of single link
- **Consistent naming**: Centralize product titles in products.json for brand consistency
- **Clean URL philosophy**: Avoid unnecessary redirect files when native structure works
- **Legacy cleanup**: Remove old staging paths to prevent user confusion

### Fixes applied
- Removed staging template and `_site/p` remnants; deleted `src/products.njk` and removed the `_redirects` mappings.
- Moved Product JSON-LD out of `base.njk`; page-level JSON-LD is now supplied via `head_jsonld` (front matter) in `src/consulting-60.md`.
- Standardized head meta via `seo.njk` include in `base.njk` (canonical, description, robots/googlebot, og:image).
- Set HTML cache policy to `public, max-age=0, must-revalidate`; kept asset caching at `public, max-age=31536000, immutable` via `_headers`.
- Updated `sitemap.njk` to output `/consulting-60/` and derive `<lastmod>` from `lastmod` or `page.date`.

### Guardrails / How to avoid next time
- **Ensure unique permalinks** before commit:
  ```bash
  # list all permalinks and look for duplicates
  grep -RniE '^permalink:\s' src | sort -t: -k3
  # spot-check a specific route
  grep -Rni "permalink: /consulting-60/index.html" src || echo "(ok)"
  ```
- **Keep JSON-LD page-scoped** via `head_jsonld` or per‑page include. Never place product‑specific JSON-LD in `base.njk`.
- **Redirect discipline**:
  - Prefer no `_redirects` unless required. If used, review at release and remove when obsolete.
  - Verify behavior per deployment:
    ```bash
    # expect 200 or 308 to /consulting-60/ (no /p/)
    curl -i "https://<preview>.agent-site2.pages.dev/consulting-60/index.html" | sed -n '1,15p'
    ```
- **Head tag sanity check** (canonical/robots/googlebot/og:image):
  ```bash
  curl -sL "https://agent.elevationary.com/consulting-60/" \
  | tr '\n' ' ' \
  | grep -oiE '<link[^>]+rel=.canonical[^>]*>|<meta[^>]+name=.(description|robots|googlebot).[^>]*>|<meta[^>]+property=.og:image[^>]*>' \
  || echo "(head tags not found)"
  ```
- **Sitemap content check**:
  ```bash
  curl -sL "https://agent.elevationary.com/sitemap.xml" | sed -n '1,60p'
  # Expect only <loc>https://agent.elevationary.com/consulting-60/</loc> and recent <lastmod>
  ```
- **Headers/caching checks**:
  ```bash
  # HTML
  curl -sI "https://agent.elevationary.com/consulting-60/" | grep -iE 'content-type|cache-control'
  # Assets
  curl -sI "https://agent.elevationary.com/assets/og-consulting-60.png" | grep -i cache-control
  ```

### References (local decisions)
- HTML cache: `public, max-age=0, must-revalidate`.
- Assets cache: `public, max-age=31536000, immutable`.
- Canonical/robots: Product page **index**; catalog root **noindex**; keep robots and googlebot in parity.
- Sitemap: single URL for now; `<lastmod>` from `front matter lastmod` or `page.date`.
