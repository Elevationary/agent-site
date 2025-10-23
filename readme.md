
# Elevationary – Ops & Infra README

_Last updated: 2025-10-23 by James_

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







































































Got it. Here’s a single, reconciled README.md you can paste straight into VS Code. I merged all variants, de-duplicated sections, kept the numbering 1–22, and aligned labels (e.g., §6 = policy; §17 = validation log). I also added a tiny appendix for the files you’re attaching in the Project.

⸻

Elevationary – Ops & Infra README

Last updated: [fill date/time] by [owner]

Purpose: Source-of-truth for domains/DNS, repo/hosting, booking & Stripe wiring, AEO/ACP metadata, security posture, and operational checklists.
Rule: When anything changes (DNS, booking URL, Stripe link, file paths), update here first.

⸻

Table of Contents
	1.	Environment Inventory
	2.	Domains & DNS
	3.	Micro-site (Agent/AEO) – Repo & Hosting
	4.	Key URLs & IDs
	5.	Link Exposure Policy (keep agent subdomain human-hidden)
	6.	JSON-LD / AEO Policy (what “good” looks like)
	7.	Cloudflare Pages Headers (security & cache)
	8.	Quick Ops Commands (sanity checks)
	9.	Known Nuances / Future Notes
	10.	Change Log
	11.	Owners (see §22)
	12.	Security & Access
	13.	Email Deliverability Posture
	14.	DNS/TLS Posture
	15.	Stripe & Booking Configuration
	16.	Analytics & Search
	17.	AEO / ACP Validation Log (dated runs)
	18.	Cloudflare Pages – Project Details
	19.	Main Site (Google Sites) – Canonicals & Exposure
	20.	DNS Snapshots & Rollback
	21.	Change Control & Releases
	22.	Owners & On-call (canonical list)

⸻

1) Environment Inventory

Workstation
	•	OS: macOS
	•	Shell: zsh (Terminal)
	•	Editor: VS Code
	•	Git: Apple Git (Xcode CLT)

Source Control
	•	GitHub Org/Repo: Elevationary/agent-site
	•	Default branch: main
	•	Repo visibility: Public
	•	Branch protection: Enabled (on main)
	•	Secrets / Deploy keys / Actions: None currently

Hosting
	•	Static host/CDN: Cloudflare Pages
	•	Custom domain (agent micro-site): https://agent.elevationary.com
	•	Pages dev alias: https://agent-site2.pages.dev

Primary Web
	•	Google Sites (public site): https://www.elevationary.com
	•	Site editor: sites.google.com

Google Workspace
	•	Admin Console: for @elevationary.com
	•	Calendar: Appointment Schedules (with Stripe payments)
	•	Analytics: GA4 connected (property for elevationary.com)
	•	Search Console: Property for main site; add URL-prefix property for https://agent.elevationary.com/

Payments / Scheduling
	•	Stripe: Pay Links (used by Google Calendar payments)
	•	Google Calendar: Booking pages (collects payment via Stripe)

Schema / AEO
	•	Schema.org JSON-LD embedded in micro-site pages for AEO/ACP

⸻

2) Domains & DNS

2.1 elevationary.ai (Spaceship)
	•	Registrar / DNS: Spaceship
	•	Nameservers: launch1.spaceship.net, launch2.spaceship.net
	•	Redirect: 301 → https://www.elevationary.com (FreeSSL)

DNS Records (Spaceship)

# A (for redirect hosting)
@    A     15.197.162.184     5m
*    A     15.197.162.184     5m

# Email forwarding (Spaceship)
@    MX    mx1.efwd.spaceship.net    20m
@    MX    mx2.efwd.spaceship.net    20m
@    TXT   v=spf1 include:spf.efwd.spaceship.net ~all   20m

Email forwarding
	•	subscribe@elevationary.ai → ar@elevationary.com
	•	support@elevationary.ai → ar@elevationary.com
	•	info@elevationary.ai → ar@elevationary.com
	•	ar@elevationary.ai → ar@elevationary.com
	•	james.szmk@elevationary.ai → james.szmak@elevationary.com

⸻

2.2 elevationary.com (Google/GoDaddy console until Squarespace transition)
	•	DNS Manager: dcc.secureserver.net (temporary Google/GoDaddy console)
	•	Nameservers: ns67.domaincontrol.com, ns68.domaincontrol.com
	•	Forwarding: None (Apex + www serve Google Sites via A + CNAME)

DNS Records (current)

# Apex to Google Sites (required 4 A records)
@    A     216.239.32.21     600s
@    A     216.239.34.21     600s
@    A     216.239.36.21     600s
@    A     216.239.38.21     600s

# www to Google Sites
www  CNAME ghs.googlehosted.com.    1h

# Agent micro-site (Cloudflare Pages)
agent  CNAME  agent-site2.pages.dev.   1h

# MX (Google Workspace)
@  MX  aspmx.l.google.com. (Prio 1)    600s
@  MX  alt1.aspmx.l.google.com. (5)    600s
@  MX  alt2.aspmx.l.google.com. (5)    600s
@  MX  aspmx2.googlemail.com. (10)     600s
@  MX  aspmx3.googlemail.com. (10)     600s
@  MX  aspmx4.googlemail.com. (30)     1h
@  MX  aspmx5.googlemail.com. (30)     1h

# TXT
@  TXT  MS=ms47159959                     1h
@  TXT  v=spf1 include:_spf.google.com ~all   600s

# SRV (Google IM/legacy)
_jabber._tcp        20 0 5269 xmpp-server.2.1.google.com.   1h
_jabber._tcp        20 0 5269 xmpp-server.1.1.google.com.   1h
_xmpp-server._tcp   20 0 5269 xmpp-server1.1.google.com.    1h
_xmpp-server._tcp   20 0 5269 xmpp-server2.1.google.com.    1h
_xmpp-server._tcp   20 0 5269 xmpp-server3.1.google.com.    1h
_xmpp-server._tcp    5 0 5269 xmpp-server.1.google.com.     1h

Note: A transition to Squarespace registrar flow is expected in 2026 — revisit this README before that change.

⸻

3) Micro-site (Agent/AEO) – Repo & Hosting
	•	Repo: Elevationary/agent-site
	•	Branch: main → auto-deploys to Cloudflare Pages project agent-site2
	•	Custom domain: agent.elevationary.com (CNAME → agent-site2.pages.dev)
	•	Headers: _headers in repo root controls security/cache for Pages
	•	Build: Static (no build command; output = repo root)

Current tree (key files)

/
├─ _headers
├─ .gitignore
├─ index.html                 # Catalog (noindex) → links to product pages
├─ robots.txt
├─ sitemap.xml
├─ readme.md                  # This file
├─ assets/
│  ├─ elevationary-logo-512.png
│  └─ og-consulting-60.png
└─ consulting-60/
   └─ index.html              # Product page (index,follow) with JSON-LD


⸻

4) Key URLs & IDs (quick copy/paste)
	•	Human booking (60-min):
https://calendar.app.google/FLe6Q6WzHQkHRK7v7
	•	Human details page:
https://www.elevationary.com/bookings/60-minute-ai-strategy-consultation
	•	Agent page (60-min):
https://agent.elevationary.com/consulting-60/
	•	Agent catalog (root):
https://agent.elevationary.com/
	•	Stripe Pay Link (60-min):
https://buy.stripe.com/3cI8wO9nzcVOffFf98eIw00
	•	Assets (agent subdomain):
Logo 512: https://agent.elevationary.com/assets/elevationary-logo-512.png
OG image: https://agent.elevationary.com/assets/og-consulting-60.png

⸻

5) Link Exposure Policy (keep agent subdomain human-hidden)

In Google Sites (editor)
	•	Header nav: no link to agent.elevationary.com
	•	Footer: no link to agent subdomain
	•	Buttons/CTAs: consulting CTAs → Google Booking link
	•	Embeds: avoid URL previews/cards of the agent subdomain

On the published site
	•	Per page: find agent.elevationary.com → none
	•	Site search: no results for agent.elevationary.com
	•	Google: site:elevationary.com "agent.elevationary.com" → none

Analytics
	•	GA4 outbound clicks filtered by agent.elevationary.com = 0

⸻

6) JSON-LD / AEO Policy (what “good” looks like)

60-min page /consulting-60/
	•	<meta name="robots" content="index,follow">
	•	JSON-LD includes:
	•	Organization node with stable @id: https://www.elevationary.com/#organization
	•	Product node:
	•	@id: https://agent.elevationary.com/consulting-60/#product
	•	offers.url: Google Booking link (payment occurs inside Booking)
	•	additionalProperty.paymentLink: Stripe Pay Link (for agentic use/ACP)
	•	image: points to assets on agent subdomain (not lh3.googleusercontent...)
	•	Root catalog / is noindex (to avoid cluttering human SERPs)

Validation tools
	•	Google Rich Results Test (URL mode)
	•	Schema.org validator (URL mode)

⸻

7) Cloudflare Pages Headers (security & cache)

/_headers (repo root):

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cache-Control: public, max-age=600

/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Don’t let the default *.pages.dev host index
https://agent-site2.pages.dev/*
  X-Robots-Tag: noindex, nofollow


⸻

8) Quick Ops Commands (sanity checks)

Headers

curl -sI https://agent.elevationary.com/consulting-60/ | grep -i 'content-type\|cache-control'
# Expect: text/html; charset=utf-8  AND  Cache-Control: public, max-age=600

Assets cache

curl -sI https://agent.elevationary.com/assets/elevationary-logo-512.png | grep -i cache-control
# Expect: max-age=31536000, immutable

Canonical & OG present

curl -sL https://agent.elevationary.com/consulting-60/ | grep -i '<link rel="canonical"\|og:image'

Sitemap

open https://agent.elevationary.com/sitemap.xml


⸻

9) Known Nuances / Future Notes
	•	elevationary.com will transition to Squarespace registrar flow in 2026 — re-verify DNS after transfer.
	•	Google Sites blocks <script> → we use the agent micro-site for JSON-LD/AEO/ACP.
	•	Google Calendar’s Stripe integration works only with the primary calendar.

⸻

10) Change Log
	•	[fill date] – Initial consolidation of env/DNS/repo/agent setup.
	•	[fill date] – Moved OG/logo assets to agent subdomain; updated JSON-LD accordingly.

⸻

11) Owners

See §22 Owners & On-call for the canonical roster.

⸻

12) Security & Access
	•	2FA (required for all admins):
	•	GitHub: [on/off]
	•	Cloudflare: [on/off]
	•	Google Workspace (admin): [on/off]
	•	Stripe: [on/off]
	•	Break-glass / recovery:
Recovery codes stored: [where] • Last verified: [date]
	•	Access roster (owners/admins):
	•	GitHub Org Owners: [ar@elevationary.com, …]
	•	Cloudflare Account Owners: [ar@elevationary.com, …]
	•	Google Workspace Super Admins: [james.szmak@elevationary.com, …]
	•	Stripe Admins: [ar@elevationary.com, …]
	•	Password manager policy: [1Password/…] required for all admins.

⸻

13) Email Deliverability Posture

elevationary.com (Google Workspace)
	•	SPF (present): v=spf1 include:_spf.google.com ~all
	•	DKIM: selector = [selector] • status = [pass/fail] • last checked: [date]
	•	DMARC (recommended if missing):

v=DMARC1; p=none; rua=mailto:dmarc@elevationary.com; fo=1; adkim=s; aspf=s; pct=100

Start with p=none for monitoring; consider quarantine/reject later.

elevationary.ai (Spaceship forwarding)
	•	SPF (forwarder): v=spf1 include:spf.efwd.spaceship.net ~all
	•	DMARC (recommended; forwarding domain — keep p=none):

v=DMARC1; p=none; rua=mailto:dmarc@elevationary.com; fo=1; adkim=s; aspf=s; pct=100



⸻

14) DNS/TLS Posture
	•	Nameservers
	•	elevationary.com: ns67.domaincontrol.com, ns68.domaincontrol.com (Google/GoDaddy console)
	•	elevationary.ai: launch1.spaceship.net, launch2.spaceship.net (Spaceship)
	•	HSTS: [disabled] (enable later after verifying subdomains)
Suggested header (later):
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
	•	DNSSEC: [off] (plan carefully if/when moving nameservers)
	•	Cutover TTL policy: set apex A + key CNAMEs to 300s during changes
	•	Zone backups:
	•	Last full export (.com): [date] → /docs/dns-backups/elevationary.com-YYYYMMDD.txt
	•	Last full export (.ai): [date] → /docs/dns-backups/elevationary.ai-YYYYMMDD.txt

⸻

15) Stripe & Booking Configuration

Stripe
	•	Account mode: [Live/Test]
	•	Payment Link (60-min): https://buy.stripe.com/3cI8wO9nzcVOffFf98eIw00
	•	(If used) Product/Price IDs: prod_… / price_… (record in /docs/stripe-ids.md)
	•	Radar/Fraud rules: [default/notes]

Google Calendar – Appointment Schedule
	•	Public booking URL (60-min): https://calendar.app.google/FLe6Q6WzHQkHRK7v7
	•	Stripe payment: Enabled (required)
	•	Price (Calendar): $395
	•	Buffers / Min notice / Max horizon: [x] / [y] / [z]
	•	Cancellation policy (verbatim): [text shown on booking form]
	•	Refund policy URL (site): [URL or “TBD”]
	•	Writes events to: Primary calendar (required for Stripe)

⸻

16) Analytics & Search
	•	GA4 (elevationary.com): Measurement ID = [G-Q4SVKSZRRB] (verify)
Installed via Google Sites → Settings → Analytics.
	•	Search Console
	•	Property: https://www.elevationary.com (verified: [Y/N], method: [DNS/HTML])
	•	URL-prefix: https://agent.elevationary.com/ (verified: [Y/N], method: HTML file)
	•	Sitemaps
	•	Main site (Sites): [n/a or URL if present]
	•	Agent micro-site: https://agent.elevationary.com/sitemap.xml (status: [OK])

⸻

17) AEO / ACP Validation Log (dated runs)

§6 defines the policy; this section records actual validator runs.

	•	[date] – /consulting-60/
	•	Robots: index,follow
	•	Canonical: present → https://agent.elevationary.com/consulting-60/
	•	JSON-LD:
	•	Org @id: https://www.elevationary.com/#organization
	•	Product @id: https://agent.elevationary.com/consulting-60/#product
	•	offers.url: Google Booking link (OK)
	•	additionalProperty.paymentLink: Stripe Pay Link (OK)
	•	image: agent assets (OK)
	•	Validators:
	•	Google Rich Results Test: [OK/notes]
	•	Schema.org validator: [OK/notes]

⸻

18) Cloudflare Pages – Project Details
	•	Project: agent-site2
	•	Repo/branch: Elevationary/agent-site → main
	•	Custom domain: agent.elevationary.com → agent-site2.pages.dev (CNAME)
	•	Headers: /_headers (security + cache)
	•	HTML cache: Cache-Control: public, max-age=600
	•	Assets cache: Cache-Control: public, max-age=31536000, immutable
	•	Default *.pages.dev: X-Robots-Tag: noindex, nofollow
	•	Pages Analytics: [enabled/disabled]

⸻

19) Main Site (Google Sites) – Canonicals & Exposure
	•	Apex mapping (4×A) + www CNAME to Google Sites: Configured
	•	Canonical policy: prefer www (as enforced by Google Sites)
	•	Link Exposure Policy (implementation):
	•	No header/footer/nav/CTA links to agent.elevationary.com
	•	Periodically re-check (on-page search, site search, Google site: query)

⸻

20) DNS Snapshots & Rollback
	•	Snapshots saved (see §14 locations).
	•	Rollback plan: If outage post-change → restore previous nameservers/records per snapshot files, clear caches (Cloudflare/browser), retest apex + www.

⸻

21) Change Control & Releases
	•	Branch protection (main): required PR, 1 approval [Y/N], status checks [N/A]
	•	Commit convention: feat:, fix:, docs:, chore:, ops:
	•	Release tagging (Pages): tag infra/content stable states vYYYY.MM.DD
	•	Hotfix procedure: hotfix/* branch → PR to main (bypass feature queue when necessary)

⸻

22) Owners & On-call
	•	Infra/Repo (Cloudflare Pages, GitHub): [name/email]
	•	DNS (.com/.ai): [name/email]
	•	Google Sites: [name/email]
	•	Stripe/Booking (pricing, Pay Links, policies): [name/email]
	•	AEO/JSON-LD/ACP: [name/email]
	•	Security/Compliance (SPF/DKIM/DMARC, 2FA): [name/email]

⸻

Appendix A — Project Files to Keep Attached (for fast reference)
	•	readme.md (this file)
	•	robots.txt (agent subdomain)
	•	sitemap.xml (agent subdomain)
	•	_headers (Cloudflare Pages headers)
	•	schema-product.template.jsonld (your JSON-LD product template)
	•	URLs.csv (key links for quick testing)
	•	OPS-CHECKLISTS.md (deploy, AEO validation, booking/Stripe, DNS checklists)

Appendix B — “How we use this file”
	•	Treat this as the single source of truth for infra & wiring.
	•	Update here first, then implement changes.
	•	Keep §17 validation logs up to date after each material change (AEO/ACP/JSON-LD).
	•	When we migrate DNS to Cloudflare in the future, update §2, §14, §18 accordingly.

⸻
=============================
MAJOR UPDATE:  25.10.22.01
=============================
## 23) DNS Cutover & Email – October 2025

**elevationary.com**
- Nameservers → Cloudflare (`clarissa.ns.cloudflare.com`, `henry.ns.cloudflare.com`).
- A/WWW → Google Sites (unchanged behavior), managed in Cloudflare DNS.
- Agent subdomain: `agent.elevationary.com` CNAME served by Cloudflare (resolves to CF Anycast A at 172.67.187.40 / 104.21.56.158).
- Email:
  - SPF: `v=spf1 include:_spf.google.com ~all`
  - DKIM: `google._domainkey` TXT published (Google Workspace)
  - DMARC: managed by Cloudflare (policy: `p=none` for now)

**elevationary.ai**
- Nameservers → Cloudflare (CF shows zone **Active**).
- Redirects (Rules → Redirect Rules):
  - **Rule A (apex)**: `https://elevationary.ai/*` → `https://www.elevationary.com/${1}` (301)
  - **Rule B (any subdomain)**: `https://*.elevationary.ai/*` → `https://www.elevationary.com/${1}` (301)
- Email (Cloudflare Email Routing enabled):
  - MX: `route1/2/3.mx.cloudflare.net`
  - SPF: `v=spf1 include:_spf.mx.cloudflare.net ~all`
  - DKIM (CF): `cf2024-1._domainkey` TXT present
  - Forwarding to `@elevationary.com` verified (info@, ar@)

**Validation (Oct 22, 2025)**
- 301 checks:
  - `curl -I "https://elevationary.ai/foo?x=1"` → 301 to `/foo?x=1` on `www.elevationary.com` ✅
  - `curl -I "https://blog.elevationary.ai/test"` → 301 to `/test` on `www.elevationary.com` ✅
- Agent site: `https://agent.elevationary.com/consulting-60/` loads with valid TLS ✅

**DNSSEC**
- Status: **Deferred** for one week to minimize risk of SERVFAIL during transition.
- Next action (see § Roadmap): enable DNSSEC in CF, publish DS at registrars, verify with `dig +dnssec` and DNSViz.

**HSTS**
- Status: **Not yet enabled**.
- Plan: stage via `_headers` → `max-age=300` (1 week), then `86400`, then consider `31536000; includeSubDomains` after full HTTPS audit.

---

## 24) Operations – Quick Commands

```bash
# Agent site still HTML + cache headers OK?
curl -sI https://agent.elevationary.com/consulting-60/ | \
  grep -i 'content-type\|cache-control'

# .ai redirects
curl -I "https://elevationary.ai/foo?x=1"
curl -I "https://blog.elevationary.ai/test"

# SPF / DKIM / DMARC spot-checks
dig +short TXT elevationary.com
dig +short TXT _dmarc.elevationary.com
dig +short TXT google._domainkey.elevationary.com
dig +short TXT elevationary.ai
dig +short TXT _dmarc.elevationary.ai
dig +short TXT cf2024-1._domainkey.elevationary.ai

# DNSSEC (after we enable it)
dig +dnssec elevationary.com A
dig +dnssec elevationary.ai A

=========================
delta drop-in 25.10.22.02
=========================
### SSL/TLS & DNS (post-cutover)

- Universal SSL: **Active** (SANs: `*.elevationary.com`, `elevationary.com`)
- SSL mode: **Full** (may move to **Full (Strict)** after verification)
- HSTS: **On**, max-age=1 month, includeSubDomains=Off, Preload=Off
- `www.elevationary.com` → **Proxied** CNAME to `ghs.googlehosted.com`
- `elevationary.com` (apex) → **Proxied** (currently 4×A 216.239.* via Google Sites)  
  - Option: replace with **flattened CNAME** `@ → www.elevationary.com` (Proxied)
- Optional redirect: apex → `https://www.elevationary.com${uri}` (301) via Redirect Rule
- Sanity:
  - `dig +short elevationary.com|www.elevationary.com` → Cloudflare IPs (104/172)
  - `curl -I https://elevationary.com|www.elevationary.com` → `strict-transport-security` header present


End of README