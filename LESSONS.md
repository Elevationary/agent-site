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

## 2025-10-30 — Eleventy + CF Pages postmortem (consulting-60, /p/, headers, sitemap)

### Symptoms observed
- Product page intermittently rendered wrong head tags (empty/templated values), and in one build the output lacked expected `<html>/<head>` context.
- Requests to `/consulting-60/` were redirected to `/p/consulting-60/` on some deployments.
- Sitemap initially pointed to `/p/consulting-60/` and `<lastmod>` lagged.
- Mixed caching expectations between HTML and assets.

### Root causes
1) **Duplicate permalink targets**: Two templates attempted to write `_site/consulting-60/index.html` (`src/consulting-60.html/.njk` and `src/consulting-60.md`), triggering Eleventy `DuplicatePermalinkOutputError` and/or nondeterministic output during iterations.
2) **JSON-LD placed in the base layout**: A Product JSON-LD block lived in `base.njk`, causing it to render on non-product pages and to pick up incorrect/empty variables. This also complicated head verification because placeholders like `{{ product.title }}` could leak into prod when context was missing.
3) **Stale staging redirect rules**: A `_redirects` file mapped `/consulting-60 → /p/consulting-60/` (and variants). Even after code changes, deployments honored those redirects until the file was removed, creating inconsistent behavior between local and prod.
4) **Cache/edge behavior expectations**: HTML is effectively dynamic (not cached long at edge) while assets are immutable; earlier assumptions around short-lived HTML caching vs the desired `must-revalidate` policy needed alignment.

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
