# STAY-ON-TASK Protocol — Agent-Site

**Timestamp:** 2025-10-30 08:02 America/Phoenix (MST)

## Purpose

Execute the Agent-Site night wrap-up checklist **sequentially**, without tangents, until all tasks are complete.

## Operating Rules

1. **One task at a time.** Start with #1 and proceed strictly in order.
2. **Gate after each task.** Output: “✅ Task *N* complete — ready for verification.” Then wait for explicit go-ahead.
3. **Single-step commands.** Provide *one* command/change at a time; await confirmation before the next.
4. **No new ideas/refactors** unless required to complete the current task.
5. **Stop on ambiguity or failure.** Ask a targeted question and propose the minimal fix.
6. **Proof before push.** Show `git add` / `git commit` (with a clear message) and `npm run build` only when ready; await approval before running.
7. **Parity checks.** After any change affecting output, verify locally, then verify the deployed URL.
8. **Record decisions.** Update `DECISIONS.md` immediately when a decision is made.

## Verification Pattern (per task)

* **Preconditions:** What must be true/available.
* **Action:** Minimal, reversible steps.
* **Local Verify:** `npm run build` + `curl/grep` checks.
* **Prod Verify:** Live URL checks and headers.
* **Done Criteria:** Observable, testable outcomes.

## Git Discipline

* Conventional commit prefix: `fix|feat|chore|docs|refactor|test|ci|perf(scope): message`.
* Tag stable checkpoints when a major milestone is reached: `git tag -a v0.1.0-consulting-60 -m "tag: consulting-60 baseline"`.

---

## Checklist (11 items)

> Work through these **in order**. Use the Verification Pattern above for each.

1. **DECISIONS.md — Canonical SEO & Build Strategy**

   * Capture: canonical path `/consulting-60/`, sitemap `<lastmod>` derived from page front matter/date, Cloudflare headers: `text/html` max-age=0; `assets/*` 1y immutable; `/sitemap.xml` 300s. Remove JSON-LD from `base.njk`; page-level only.

2. **README.md — Runbook & Verification**

   * Document local dev (`npm run build`), deploy notes (Cloudflare Pages), and the exact `curl | grep` checks for canonical/robots/googlebot/OG image.

3. **OPS-CHECKS.md — Smoke Tests**

   * Define nightly checks: canonical/robots/googlebot present; OG image resolves with long cache; sitemap lastmod and cache headers; 404 page returns; no `/p/` outputs; JSON-LD block present and valid.

4. **LESSONS.md — Postmortem**

   * Note root cause of duplicate permalinks; dangers of JSON-LD in `base.njk`; caching lessons; `_redirects` side effects; product generator pitfalls.

5. **BACKLOG.md — Product Expansion Plan**

   * Add items to: re-introduce data-driven product pages safely; generate unique permalinks; stubs for additional consults; Search Console submit; smoke script; pre-commit guard.

6. **Products Data Skeleton**

   * Draft `src/_data/products.json` with fields: `slug`, `title`, `description`, `image`, `price`, `currency`, `stripeUrl`, `indexable` (bool), `lastmod`.

7. **Product Page Generator (Safe)**

   * Create `src/product-page.njk` template with **per-item front matter** and unique `permalink: "/{{ slug }}/index.html"`. No global JSON-LD; emit per-page JSON-LD from item.

8. **Add 1–2 New Product Pages (Stubs)**

   * Example: `consulting-90` and `consulting-120` using the generator + products data. Verify canonical, robots, OG, JSON-LD, and sitemap.

9. **Sitemap Enhancements**

   * Ensure sitemap iterates products data; `<lastmod>` from each item’s `lastmod` or page date; keep 300s cache header; verify live.

10. **Automation: Smoke Script & NPM Task**

* Add `scripts/smoke.sh` and `npm run smoke` to perform all `curl | grep` checks locally and against the live site.

11. **Guardrails**

* Add a lightweight pre-commit or CI step that fails if: duplicate permalinks detected, base contains JSON-LD, or pages miss canonical/robots/googlebot.

---

## Kick-off Block (Paste to Start the Session)

```
Begin STAY-ON-TASK Protocol for Agent-Site Wrap-Up (11 tasks).
Task 1: Update DECISIONS.md with canonical URL strategy, sitemap <lastmod> derivation, and Cloudflare cache policy; confirm JSON-LD page-level only (not in base).
Follow Operating Rules and Verification Pattern. Work one step at a time and request confirmation after each task.
```

## Logging Template (use in chat after each micro-step)

```
[Time 🕒] Action:
Local Verify:
Prod Verify:
Result:
Next:
```

### Log — Task 1 (DECISIONS.md — Canonical SEO & Build Strategy)

[Time 🕒] 2025-10-30 21:28 ET (18:28 MST)
Action: Documented canonical strategy (/consulting-60/), sitemap <lastmod> derivation, and Cloudflare cache policy; confirmed JSON-LD is page‑level only (not in base.njk).
Local Verify: Built locally; /consulting-60/ shows correct canonical, robots, googlebot, and OG image via curl checks.
Prod Verify: /consulting-60/ returns expected canonical/robots/googlebot and OG; /sitemap.xml loc → /consulting-60/ with <lastmod> 2025‑10‑29; current Cache-Control observed: public, max-age=0, must-revalidate.
Result: ✅ Task 1 complete — documentation matches current implementation.
Next: Task 2 — Update README.md (Runbook & Verification). Awaiting file access grant.

### Log — Task 2 (README.md — Runbook & Verification)

[Time 🕒] 2025-10-30 21:39 ET
Action: Appended **Runbook (v0.1)** to `README.md` covering Quick Start, repo layout, front‑matter SEO contract (page‑level JSON‑LD), copy/paste sanity checks, Cloudflare Pages deploy notes, cache policies, gotchas, add‑a‑product steps, and GSC pointers.
Local Verify: File present and correct in repo; local diff shows section added below the first `---`. Commit recorded on `main`: `b3658e3`.
Prod Verify: N/A (documentation only; does not affect build output).
Result: ✅ Task 2 complete — README now provides a concise operational runbook and verification steps.
Next: Task 3 — Prepare `OPS-CHECKS.md` with nightly smoke tests (canonical/robots/googlebot, OG image cache, sitemap `<lastmod>` & cache, 404, no `/p/`, JSON‑LD presence). Awaiting file access or permission to create.

### Log — Task 3 (OPS-CHECKS.md — Nightly Smoke Tests)

[Time 🕒] 2025-10-30 09:02 ET (07:02 MST)
Action: Refreshed `OPS-CHECKS.md` per final policies: (1) HTML cache `public, max-age=0, must-revalidate`; (2) standardized canonical/robots/googlebot/OG head grep; (3) sitemap content check (loc + <lastmod>); (4) “No staging (/p) remnants” checks (308 → /consulting-60/, 404 on /p/consulting-60/); (5) Rich Results notes (Stripe Pay Link in `offers.url`, correct price/currency/image).
Local Verify: `npm run build` OK; local curl/grep on `_site/consulting-60/index.html` shows expected tags; `_site/sitemap.xml` contains `/consulting-60/` with `<lastmod>2025-10-29` from front matter.
Prod Verify: `/consulting-60/` returns correct canonical/robots/googlebot and OG; `/sitemap.xml` contains `/consulting-60/` with `<lastmod>2025-10-29`; `/p/consulting-60/` → 404; `assets/og-consulting-60.png` served with `cache-control: public, max-age=31536000, immutable`.
Result: ✅ Task 3 complete — ready for verification.

### Log — Task 4 (LESSONS.md — Postmortem)

[Time 🕒] 2025-10-30 20:56 ET
Action: Added detailed Eleventy + Cloudflare Pages postmortem to `LESSONS.md` (symptoms, root causes, fixes, guardrails, refs). Included command snippets for duplicate-permalink checks, head/sitemap verification, redirects discipline, and cache headers.
Local Verify: `LESSONS.md` renders with new section; content includes grep/curl blocks and guardrails. Local diff clean; no build output impacted.
Prod Verify: N/A (documentation-only change; does not affect live HTML output).
Result: ✅ Task 4 complete — documentation matches repo state.
Next: Task 5 — Update `BACKLOG.md` (product expansion plan). Please grant access to `BACKLOG.md`.

### Log — Task 5 (BACKLOG.md — Product Expansion Plan)

[Time 🕒] 2025-10-30 22:05 ET (19:05 MST)
Action: Updated `BACKLOG.md` with concrete tickets for 15/30/90, products data (`offers.json`/`products.json`), sitemap iteration, redirects cleanup (remove `/p` remnants), PR toggle, smoke script, GSC submission, and guardrails.
Local Verify: Commit recorded on `main` as `57c00f2`; diff shows ~95 insertions. File renders locally and does not affect build output.
Prod Verify: N/A (documentation-only change).
Result: ✅ Task 5 complete — backlog updated and pushed.
Next: Task 6 — Create `src/_data/products.json` skeleton. Awaiting file access grant per protocol. 
### Protocol Patch — Append-Only Edits to STAY-ON-TASK
- **Rule 9 (added):** When updating `STAY-ON-TASK.MD`, you will be **appending** to the file, **never overwriting**. Use `>>` redirection only. Do not replace or truncate existing content.

### Log — Task 6 (Products Data Skeleton)
[Time 🕒] 2025-10-30 18:55 MST
Action: Reviewed `src/_data/products.json` for required fields (`slug`, `title`, `description`, `image`, `price`, `currency`, `stripeUrl`, `indexable`, `lastmod`). **No modifications are required.**
Local Verify: File exists and schema matches the spec; contents are valid JSON.
Prod Verify: N/A (data-only; no live output yet).
Result: ✅ Task 6 complete — **No modifications are required.**
Next: Task 7 — Create `src/product-page.njk` (generator template with per-item front matter and canonical/robots/OG/JSON‑LD). Awaiting file access to create this new file.
