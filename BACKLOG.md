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
- **PR discipline**: enable PRs and status checks (HTML/JSON-LD lints).
- **Monitoring**: synthetics (uptime, basic page content), Slack/email alerts.
- **Booking/Stripe**: centralize **price** and **booking** references in `offers.json` (ids/links).
- **Policies**: publish Refund & Cancellation texts and link from booking page(s).
- **Legal**: add ToS / Privacy links on the main site (if missing).

## LATER (investment; scale)
- **Newsletter product**: content pipeline, scheduling, and delivery (mail provider or custom).
- **Serverless glue**: Cloudflare Workers for webhooks (Stripe/Calendar), CRM/contact handoff.
- **DNSSEC**: enable per domain and publish DS at registrars; validate with DNSViz.
- **HSTS hardening**: extend max-age; consider `includeSubDomains`; evaluate preload when ready.
- **Enterprise**: SSO/SAML (if needed later), audit logging, access reviews, SOC2 readiness notes.

