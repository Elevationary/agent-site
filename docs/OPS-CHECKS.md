# Ops Checks (quick copy/paste)

## ✅ PROJECT STATUS: COMPLETE (2025-11-03)

## 0. Environment Verification (The Engine)
*   [ ] **Virtual Env**: Is `venv/` present and active? (`source venv/bin/activate`)
*   [ ] **Dependencies**: Does `requirements.txt` exist? Are they installed? (`pip freeze`)
*   [ ] **Secrets**: Is `.env` present? (Ensure no placeholders in production).
*   [ ] **Gitignore**: Does it exclude `venv/` and `.env`?

All consultation pages (15/30/60/90) are live with:
- Stable Eleventy build process
- Consistent JSON-LD structured data
- Comprehensive smoke testing (12 tests passing)
- Centralized product data management
- Enhanced 404 page with all consultation options
- Clean URL structure with no legacy redirects
- Optimized homepage for SEO/crawler purpose with minimal UI
- Enhanced consultation page content with standardized structure and inclusive language

## GSC/Analytics Housekeeping

### Google Search Console Inspection URLs
- **15-Minute Consultation**: https://search.google.com/search-console/inspect?url=https://agent.elevationary.com/consulting-15/
- **30-Minute Consultation**: https://search.google.com/search-console/inspect?url=https://agent.elevationary.com/consulting-30/
- **60-Minute Consultation**: https://search.google.com/search-console/inspect?url=https://agent.elevationary.com/consulting-60/
- **90-Minute Consultation**: https://search.google.com/search-console/inspect?url=https://agent.elevationary.com/consulting-90/

### Request Indexing Cadence
- **Initial submission**: Request indexing for all 4 product pages immediately after deployment
- **Weekly check**: Inspect each page weekly for coverage and indexing status
- **Monthly refresh**: Request indexing for any pages showing "Not in coverage" or "Duplicate without user-selected canonical"
- **Content updates**: Request indexing immediately after any content changes to product pages
- **Seasonal adjustment**: Increase frequency during business planning seasons (Q1, Q4)

### Analytics Implementation Plan
- **Lightweight pageview events**: Implement Google Analytics 4 pageview tracking
- **Event tracking**: Track consultation page views and outbound clicks to booking URLs
- **No heavy tracking**: Avoid complex funnels or user behavior tracking for this micro-site
- **Privacy-focused**: Minimal data collection, no personal identifiers
- **Implementation timing**: Once content set is finalized and stable

## Booking URL Monitoring

### URL Validation Commands
```bash
# Check current booking URLs in products.json
cat src/_data/products.json | jq -r '.[].booking_url'
# Expected: 4 valid Google Calendar booking URLs

# Verify URLs are accessible (return 200)
for url in $(cat src/_data/products.json | jq -r '.[].booking_url'); do
  echo "Checking $url..."
  curl -sI "$url" | head -1
  # Expected: HTTP/2 200 for all URLs
done

# Compare with live consultation pages
curl -sL https://www.elevationary.com/consulting/60-minute-ai-strategy-consultation | grep -o 'https://calendar\.google\.com[^" ]*'
# Should match products.json booking URLs
```

### Monitoring Cadence
- **Weekly check**: Verify all booking URLs return 200 status
- **Monthly audit**: Compare products.json URLs with live consultation pages
- **Event-driven**: Check URLs immediately after any Google Calendar settings changes
- **Pre-deployment**: Validate URLs before any site updates

### Alerting & Remediation
- **URL change detection**: Any 404/redirect triggers immediate alert
- **Update workflow**: Modify products.json → rebuild site → deploy update
- **Stakeholder notification**: Email affected customers with updated booking links
- **Documentation**: Record URL changes with date and reason

## DNS & Proxies
dig +short elevationary.com
dig +short www.elevationary.com
dig +short agent.elevationary.com    # expect Cloudflare anycast A records
dig +short agent.elevationary.com CNAME  # expect: agent-site2.pages.dev

## Redirects (.ai → main site)
curl -I "https://elevationary.ai/foo?x=1"           | sed -n '1,5p'
curl -I "https://www.elevationary.ai/abc?y=2"       | sed -n '1,5p'
curl -I "https://blog.elevationary.ai/test"         | sed -n '1,5p'
# Expect: HTTP/2 301 and Location: https://www.elevationary.com/… (path/query preserved)

## TLS / HSTS
curl -sI "https://elevationary.com"            | grep -i strict-transport-security
curl -sI "https://www.elevationary.com"        | grep -i strict-transport-security
curl -sI "https://agent.elevationary.com"      | grep -i strict-transport-security
# Expect: HSTS only on agent (30d). Apex/www are on Google Sites and may not emit HSTS.

## Certificate SANs (spot-check — expect apex + wildcard)
openssl s_client -connect www.elevationary.com:443 -servername www.elevationary.com 2>/dev/null \
| openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'
openssl s_client -connect elevationary.com:443 -servername elevationary.com 2>/dev/null \
| openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'

## Headers & Caching (HTML + assets)
curl -sI "https://agent.elevationary.com/consulting-60/" \
| grep -i 'content-type\|cache-control\|strict-transport-security\|x-content-type-options\|permissions-policy\|referrer-policy'
# Expect (HTML): text/html; charset=utf-8 • Cache-Control: public, max-age=0, must-revalidate

curl -sI "https://agent.elevationary.com/assets/elevationary-logo-512.png" \
| grep -i cache-control
# Expect (assets): Cache-Control: public, max-age=31536000, immutable

## Quick HTTP checks (Booking & Payments)

# Stripe Pay Link reachable (expect HTTP/2 200 or 303)
curl -I "https://buy.stripe.com/3cI8wO9nzcVOffFf98eIw00" | head -1

# Google Booking reachable (expect HTTP/2 200)
curl -I "https://calendar.app.google/FLe6Q6WzHQkHRK7v7" | head -1

## Robots / Sitemap
curl -sI "https://agent.elevationary.com/robots.txt"  | sed -n '1,5p'
curl -sI "https://agent.elevationary.com/sitemap.xml" | sed -n '1,5p'
# Content check (expect only /consulting-60/ with ISO <lastmod>)
curl -sL "https://agent.elevationary.com/sitemap.xml" | sed -n '1,40p'
# Expect: <loc>https://agent.elevationary.com/consulting-60/</loc> and a recent <lastmod>.

## No staging (/p) remnants

# /consulting-60/index.html should resolve to /consulting-60/ (not /p/*)
curl -i "https://agent.elevationary.com/consulting-60/index.html" | sed -n '1,12p'
# Expect: 200 OK or 308 → /consulting-60/ (no /p/ in Location)

# /p/consulting-60/ should not exist
curl -I "https://agent.elevationary.com/p/consulting-60/" | head -1
# Expect: HTTP/2 404

## Canonical & OG on product page
curl -sL "https://agent.elevationary.com/consulting-60/" \
| tr '\n' ' ' \
| grep -oiE '<link[^>]+rel=.canonical[^>]*>|<meta[^>]+name=.(description|robots|googlebot).[^>]*>|<meta[^>]+property=.og:image[^>]*>' \
|| echo "(head tags not found)"

## Rich Results sanity (manual)

- Confirm the product page has a correct canonical tag:
  - `<link rel="canonical" href="https://agent.elevationary.com/consulting-60/">`
- In the Product/Offer JSON-LD for `/consulting-60/`, verify before running validators:
  - `name`, `description`, and `image` point to the correct values (image → `https://agent.elevationary.com/assets/og-consulting-60.png`).
  - `offers.price` = `395.00` and `offers.priceCurrency` = `USD`.
  - `offers.url` points to the Stripe Pay Link `https://buy.stripe.com/3cI8wO9nzcVOffFf98eIw00`.
- After confirming the above, run the Rich Results Test and Schema.org validator.

## Email auth (spot check)

# elevationary.com (Google Workspace)
dig +short MX  elevationary.com
dig +short TXT elevationary.com
dig +short TXT _dmarc.elevationary.com
dig +short TXT google._domainkey.elevationary.com

# elevationary.ai (Cloudflare Email Routing)
dig +short MX  elevationary.ai
dig +short TXT elevationary.ai
dig +short TXT _dmarc.elevationary.ai
dig +short TXT cf2024-1._domainkey.elevationary.ai

## CSS + 404 quick checks
curl -sI "https://agent.elevationary.com/assets/styles.css" | grep -i cache-control
# Expect: max-age=31536000, immutable

curl -I "https://agent.elevationary.com/this/does/not/exist" | head -1
# Expect: HTTP/2 404

---

## Archive additions (2025-10-24)

### Redirect rules (.ai → www .com)
```bash
curl -I "https://elevationary.ai/foo?x=1" | sed -n '1p;/^location:/Ip'
curl -I "https://blog.elevationary.ai/test" | sed -n '1p;/^location:/Ip'
# Expect: HTTP/2 301 and Location: https://www.elevationary.com/… (path/query preserved)
```

### Headers / HSTS / cache
```bash
curl -sI https://agent.elevationary.com/consulting-60/ \
| grep -i 'strict-transport-security\|cache-control\|content-type'
# Expect HSTS on, HTML cache 0s (must-revalidate), and text/html; charset=utf-8

curl -sI https://agent.elevationary.com/assets/elevationary-logo-512.png \
| grep -i 'cache-control'
# Expect: max-age=31536000, immutable
```

### JSON-LD presence (quick grep)
```bash
curl -sL https://agent.elevationary.com/consulting-60/ \
| grep -i '<script type="application/ld+json"' -n
# Expect ≥1 match (Product/Offer present)
```

### Certificate SANs (spot-check)
```bash
openssl s_client -connect www.elevationary.com:443 -servername www.elevationary.com 2>/dev/null \
| openssl x509 -noout -text | sed -n '/Subject:/p;/X509v3 Subject Alternative Name/,+1p'
```

### Email auth (DNS)
```bash
dig +short TXT _dmarc.elevationary.com
dig +short TXT google._domainkey.elevationary.com
dig +short TXT elevationary.ai
# Expect DMARC p=none (CF reports), Google DKIM on .com, and CF routing SPF on .ai
```
