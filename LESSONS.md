_Last updated: 2025-10-26 (America/Phoenix)_

# Lessons Learned

- CF cache can serve old meta for minutes; purge **both** the page URL and any canonical/asset touched after SEO-critical edits.
- Keep agent subdomain unlinked from human site to avoid blending audiences/UX.

# Lessons Learned

## 2025-10-24 — From MiniMVP + cutovers

**Cloudflare cache**
- Pages can serve stale HTML after meta/header edits. Use targeted purge (by URL) or version assets; expect a brief lag.

**Redirect rules syntax**
- Use **`${1}`** capture groups (not `$1`) in Cloudflare Redirect Rules to preserve path/query.

**TLS & certs**
- To confirm SAN coverage, use:
openssl s_client -connect www.elevationary.com:443 -servername www.elevationary.com 2>/dev/null 
| openssl x509 -noout -text | sed -n ‘/Subject:/p;/X509v3 Subject Alternative Name/,+1p’

- “Proxied” vs “DNS only” determines whether Cloudflare’s cert applies. DNS-only hosts won’t be covered by CF TLS.

**curl tips**
- Use `-L` for canonical/redirect scenarios.
- Avoid “double protocol” typos (`https://https://…`).
- Quote URLs containing `?` to avoid shell globbing issues.

**Robots parity**
- Keep `robots` and `googlebot` meta tags aligned; constrain previews on indexable agent pages to avoid unwanted human snippets.

**Search Console verification**
- URL-prefix with HTML file is simple and robust for subdomains; re-verify after host/headers changes if needed.
# Lessons Learned

## Quick hits

- Cloudflare can serve **stale HTML** for a few minutes; after SEO/meta changes, purge **both** the page URL and any referenced assets, or bump the asset filename/version.
- Keep the **agent subdomain unlinked** from the human site to avoid UX/audience bleed.
- In **Cloudflare Redirect Rules**, use capture placeholders like **`${1}`** (not `$1`).
- When testing redirects/canonicals, prefer `curl -sIL` and **quote URLs** that contain `?`.
- Align **`robots`** and **`googlebot`** meta; on indexable agent pages use: `index,follow,noarchive,max-snippet:0,max-image-preview:none`.
- Cloudflare TLS certs apply only to **Proxied** DNS records; **DNS only** hosts present the origin’s cert.

## 2025-10-24 — From MiniMVP + cutovers

**Cloudflare cache**
- Pages may serve stale HTML after meta/header edits. Use **Purge by URL** for the edited page and affected assets, or version the assets. Expect a short edge lag.

**Redirect rules syntax**
- For zone-wide .ai → .com redirect, match on the host and preserve path/query with capture groups.
- Capture groups use curly braces: **`${1}`, `${2}` …** not `$1`.

**TLS & certs**
- “Proxied” vs. “DNS only” determines which TLS certificate is presented (Cloudflare vs. origin).
- To view SANs quickly:

```bash
# www cert SANs
openssl s_client -connect www.elevationary.com:443 -servername www.elevationary.com 2>/dev/null | \
openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'

# apex cert SANs (shows even though it 301s)
openssl s_client -connect elevationary.com:443 -servername elevationary.com 2>/dev/null | \
openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'
```

**curl tips**
- Use `-L` to follow redirects and `-I` for headers.
- Quote URLs with `?` to avoid shell globbing, e.g., `curl -I "https://example.com/abc?x=1*"`.

**Robots parity**
- Keep `<meta name="robots">` and `<meta name="googlebot">` in sync.  
  - Product page: `index,follow,noarchive,max-snippet:0,max-image-preview:none`  
  - Catalog root: `noindex,follow`

**Search Console verification**
- URL‑prefix + HTML file is robust for the agent subdomain; re‑verify after major hosting/header changes or domain moves.

**HSTS posture**
- Start at **30 days**, **no includeSubDomains**, **no preload**. Raise scope only after confirming TLS across all needed hostnames.
