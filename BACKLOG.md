# Backlog / Open Decisions

- Newsletter platform choice (ConvertKit/Substack/beehiiv vs. homegrown) — Phase 2.
- Contractor pool model & SLAs — Phase 3.
- DNSSEC enablement (staged) — Revisit after 1 week of stability.

# Backlog (Now / Next / Later)

_Last updated: 2025-10-27 (America/Phoenix)_

## NOW (low effort, scales)
- **Eleventy scaffold**: `/src` + `.eleventy.cjs`; single source of truth (`/src/_data/offers.json`) to drive pages, JSON-LD, sitemap, buttons.
- **Templates**: `consulting-60.njk` → parametrized for 15/30/90 variants; shared partials for head/meta/JSON-LD.
- **Sitemap generation** (11ty) from `offers.json`; include only indexable URLs.
- **Robots/meta consistency** helpers (11ty shortcodes) for `robots` + `googlebot`.
- **Cloudflare Web Analytics** on agent site (no cookies).
- **OPS docs**: keep `OPS-CHECKS.md` aligned with new endpoints, add Eleventy build check.
- **Tagging**: release tags `vYYYY.MM.DD`; short CHANGELOG entry per tag.

- **Dup pages**: 15/30/90 consults using the shared template; verify JSON-LD & sitemap per page.
- **Reviews & ratings schema (optional)**: Decide policy (real reviews only; no fakes). If/when available, add `aggregateRating` and `review` JSON-LD to product pages; wire Eleventy to pull counts/averages from a single source (e.g., `/src/_data/reviews.json`). Include moderation/consent notes.
- **Editorial workflow**: lightweight content pipeline (draft → review → publish); style guide for page copy.
- **PR flow (two-stage)**
  - *Middle-ground (optional, toggle when ready):* one-click PRs on demand; tiny checks (HTML/JSON-LD lint); direct pushes still allowed.
  - *Full discipline (later):* require PRs to `main` with blocking status checks and branch protections.
- **Monitoring**: synthetics (uptime, basic page content), Slack/email alerts.
- **Booking/Stripe**: centralize **price** and **booking** references in `offers.json` (ids/links).
- **Policies**: publish Refund & Cancellation texts and link from booking page(s).
- **Legal**: add ToS / Privacy links on the main site (if missing).
- **Performance budget**: add Lighthouse check (target ≥95 on mobile & desktop) and capture results in `OPS-CHECKS.md`; fix regressions.
- **Twitter meta**: once the @Elevationary handle exists, add `<meta name="twitter:site" content="@Elevationary">` and verify via Twitter card validator.
- **`priceValidUntil` automation**: drive Product `priceValidUntil` from `/src/_data/offers.json` and set a quarterly review reminder.
- **Redirect rule tests**: add curl tests for `.ai → www` 301 with path/query preservation to `OPS-CHECKS.md`.
- **Stripe receipt template:** Add the booking fallback line to the product’s receipt settings. [owner][date]  ￼
- **UTM tagging:** Apply the UTM pattern to the 60-min Pay Link; document for 15/30/90. [owner][date] 

## LATER (investment; scale)
- **Newsletter product**: content pipeline, scheduling, and delivery (mail provider or custom).
- **Serverless glue**: Cloudflare Workers for webhooks (Stripe/Calendar), CRM/contact handoff.
- **DNSSEC**: enable per domain and publish DS at registrars; validate with DNSViz.
- **HSTS hardening**: extend max-age; consider `includeSubDomains`; evaluate preload when ready.
- **Enterprise**: SSO/SAML (if needed later), audit logging, access reviews, SOC2 readiness notes.
- **Content Security Policy (CSP)**: start in Report-Only; tighten `default-src`, `script-src`, `img-src`, `connect-src`; then enforce.
- **Accessibility**: WCAG 2.1 AA sweep (contrast, alt text, focus order, keyboard navigation).
- **Internationalization (i18n)**: groundwork for language/currency readiness (lang attributes; currency/locale formatting).
- **Automated DNS snapshots**: monthly export of both zones via Cloudflare API to `/docs/dns-snapshots/`.
- **Link discovery (optional):** Consider a tiny “Agent catalog” link from the main site only if you want crawl discoverability; default is no link to keep it human-hidden. [owner][date] 
