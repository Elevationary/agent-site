_Last updated: 2025-10-27 (America/Phoenix)_

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
