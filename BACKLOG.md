# Backlog / Open Decisions

- Newsletter platform choice (ConvertKit/Substack/beehiiv vs. homegrown) — Phase 2.
- Contractor pool model & SLAs — Phase 3.
- DNSSEC enablement (staged) — Revisit after 1 week of stability.

# Backlog (Now / Next / Later)


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

# Backlog — Agent-Site (v2025-10-30)

## Open Decisions (track separately from sprint tasks)
- Newsletter platform choice (ConvertKit/Substack/beehiiv vs. homegrown) — Phase 2.
- Contractor pool model & SLAs — Phase 3.
- DNSSEC enablement (staged) — Revisit after 1 week of stability.

---

## NOW (next 24–48h) — Concrete tickets for production pages

### A. Single source of truth for offers
- [ ] **Create** `/src/_data/offers.json` with this minimal schema (one array of offers):
  ```json
  [
    {
      "key": "consulting60",
      "slug": "consulting-60",
      "title": "60-Minute AI Strategy Consultation",
      "description": "Prepaid AI strategy consultation via Google Meet.",
      "price": "395.00",
      "currency": "USD",
      "image": "/assets/og-consulting-60.png",
      "booking_url": "https://calendar.app.google/FLe6Q6WzHQkHRK7v7",
      "pay_url": "https://buy.stripe.com/3cI8wO9nzcVOffFf98eIw00",
      "indexable": true,
      "show_in_sitemap": true,
      "lastmod": "2025-10-29"
    }
  ]
  ```
- [ ] **Policy**: prices/URLs/images/lastmod must be edited only here; pages derive from data.

### B. Product pages (15 / 30 / 90) using the 60-min as the canonical pattern
- [ ] **Add** `src/consulting-15.md`, `src/consulting-30.md`, `src/consulting-90.md` — each with:
  - `layout: base.njk`
  - `permalink: /<slug>/index.html`
  - `eleventyComputed` pulling `title`, `description`, `og_image`, `robots`, `googlebot`, `canonical`, and `head_jsonld` **from** `offers.json` (match by `slug`).
  - Body: H1 title + two-paragraph description + booking + Stripe links.
- [ ] **Acceptance**: 
  - `curl -sL https://agent.elevationary.com/<slug>/ | tr '\n' ' ' | grep -oiE '<link[^>]+rel=.canonical[^>]*>|<meta[^>]+name=.(description|robots|googlebot).[^>]*>|<meta[^>]+property=.og:image[^>]*>'` shows correct tags.
  - JSON-LD validates in Google Rich Results for all 4 pages (15/30/60/90).

### C. Sitemap sourced from offers.json only
- [ ] **Update** `src/sitemap.njk` to iterate over `collections.all` **or** directly over `offers` data and include **only** items with `indexable && show_in_sitemap`.
- [ ] `<lastmod>`: prefer `offer.lastmod`; fallback to `page.date` when present.
- [ ] **Acceptance**:
  - `curl -sL https://agent.elevationary.com/sitemap.xml` contains only the 15/30/60/90 URLs with correct `<lastmod>`.

### D. Redirects & staging remnants
- [ ] **Ensure** no `_redirects` entries that map `/consulting-*/` → `/p/...` exist (file should be **absent**).
- [ ] **Acceptance**: `curl -i https://<preview>.agent-site2.pages.dev/consulting-60/index.html | sed -n '1,12p'` returns `200` or `308 → /consulting-60/` **not** `/p/…`; `curl -i https://agent.elevationary.com/p/consulting-60/` returns `404`.

### E. Headers & caching policy (no regressions)
- [ ] **HTML**: `Cache-Control: public, max-age=0, must-revalidate`.
- [ ] **Assets**: `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`.
- [ ] **Acceptance**:
  - `curl -sI https://agent.elevationary.com/consulting-60/ | grep -i 'content-type\|cache-control'`
  - `curl -sI https://agent.elevationary.com/assets/og-consulting-60.png | grep -i cache-control`

### F. PR workflow toggle (lightweight)
- [ ] **Add** a note in `README.md` on how to toggle PR-only mode (branch protections & tiny checks) when ready.
- [ ] **Optional**: add a simple CI lint step (HTML/JSON-LD) for PRs; keep direct pushes allowed for now.

---

## NEXT (1–3 days)
- [ ] **Policies**: Publish Refund & Cancellation text and link from all consulting pages.
- [ ] **Cloudflare Web Analytics**: add to base layout; confirm no cookies.
- [ ] **Performance budget**: Lighthouse ≥95 on mobile/desktop; capture scores in `OPS-CHECKS.md`.
- [ ] **Monitoring**: simple synthetic checks for `/` and `/consulting-*/` with Slack/email alerts.
- [ ] **UTM tagging**: document UTM pattern for Pay Links; apply to 15/30/90; capture in `README.md`.
- [ ] **Stripe receipt**: add booking fallback line in Stripe receipt template; note owner/date.
- [ ] **`priceValidUntil` automation**: quarterly review date tracked in repo and surfaced in JSON-LD.

---

## LATER (investment; scale)
- [ ] **Newsletter product**: content pipeline & delivery.
- [ ] **Serverless glue**: CF Workers for webhooks (Stripe/Calendar), CRM/contact handoff.
- [ ] **DNSSEC**: enable per domain; publish DS; validate with DNSViz.
- [ ] **HSTS hardening**: extend `max-age`; consider `includeSubDomains`; evaluate preload.
- [ ] **CSP**: start Report-Only; then enforce with tight `default-src`, `script-src`, `img-src`, `connect-src`.
- [ ] **Accessibility**: WCAG 2.1 AA sweep (contrast/alt/focus/keyboard nav).
- [ ] **Internationalization**: groundwork for language/currency readiness.
- [ ] **Automated DNS snapshots**: monthly CF API export to `/docs/dns-snapshots/`.
- [ ] **Link discovery (optional)**: consider small “Agent catalog” link from main site if crawl discoverability desired; otherwise leave hidden.

---

## Cross-references
- Keep `OPS-CHECKS.md` aligned with the acceptance commands above.
- See `DECISIONS.md` for canonical/robots policy and sitemap `lastmod` strategy.
- See `README.md` Runbook for Eleventy/CF Pages deploy and cache sanity checks.