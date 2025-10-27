
# Elevationary – Ops & Infra README

_Last updated: 2025-10-26 (America/Phoenix)_

This repo hosts the **agent micro-site** for AEO/ACP under `https://agent.elevationary.com`. The public website lives on **Google Sites** at `https://www.elevationary.com`.

---

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
├─ index.html                 # catalog (noindex)
├─ robots.txt
├─ sitemap.xml
├─ readme.md                  # this file
├─ googlef8a11de16a66c924.html  # Search Console verification
├─ assets/
│  ├─ elevationary-logo-512.png
│  ├─ og-consulting-60.png
│  └─ styles.css
└─ consulting-60/
   └─ index.html              # product page (index,follow) with JSON-LD
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
