# Summary
<!-- What is changing and why? Keep it short. Link issues if any. -->

## Change Type
- [ ] Content only (HTML/JSON-LD copy)
- [ ] Assets only (images, favicon, OG)
- [ ] Headers / caching
- [ ] SEO / robots / sitemap
- [ ] DNS / Cloudflare config
- [ ] Build/infra (repo, Pages, CI)
- [ ] Other: __________

## What changed
- Files touched:
  - [ ] `/index.html`
  - [ ] `/consulting-60/index.html`
  - [ ] `/robots.txt`
  - [ ] `/sitemap.xml`
  - [ ] `/_headers`
  - [ ] `readme.md`
  - [ ] `OPS-CHECKS.md`
  - [ ] Other: __________________

## Validation (paste/confirm outputs)
**HTML page headers**
```bash
curl -sI "https://agent.elevationary.com/consulting-60/" | grep -i 'content-type\|cache-control\|strict-transport-security\|x-content-type-options'
curl -sI "https://agent.elevationary.com/assets/elevationary-logo-512.png" | grep -i cache-control
curl -sL "https://agent.elevationary.com/consulting-60/" | grep -i '<link rel="canonical"\|og:image'
curl -sI "https://agent.elevationary.com/robots.txt"  | sed -n '1,5p'
curl -sI "https://agent.elevationary.com/sitemap.xml" | sed -n '1,5p'
	•	Google Rich Results Test: ✅/⚠️ (notes)
	•	Schema.org validator: ✅/⚠️ (notes)
curl -sI "https://elevationary.com" | grep -i strict-transport-security
curl -sI "https://www.elevationary.com" | grep -i strict-transport-security
curl -sI "https://agent.elevationary.com" | grep -i strict-transport-security
Describe exactly what changed:
	•	Records added/edited/removed:
    •	Redirect Rules created/updated:
Pre-merge plan
	•	Lower TTLs (if needed)
	•	Confirm proxy state (orange cloud) for affected hostnames
    dig +short agent.elevationary.com CNAME
Post-merge verification
curl -I "https://elevationary.ai/foo?x=1" | sed -n '1,5p'
curl -I "https://www.elevationary.ai/bar?y=2" | sed -n '1,5p'
Risk & Rollback
	•	Impacted areas: (SEO, indexing, payments, booking, email, DNS)
	•	Rollback plan:
	•	e.g., revert commit + restore prior DNS snapshot; clear Cloudflare cache

Checklists
	•	/_headers still sets security/caching correctly
	•	robots.txt/sitemap.xml aligned with new URLs
	•	JSON-LD @id, offers.url, additionalProperty.paymentLink correct
	•	Search Console (agent) sitemap re-submitted if structure changed
	•	No human-site links to agent.* (exposure policy preserved)

Screenshots / Notes
<!-- Before/after snippets, validation screenshots, or anything useful for review. -->
---

## (Optional) Specialized template for DNS changes

If you want a separate chooser for DNS work, create:
`.github/PULL_REQUEST_TEMPLATE/dns-change.md`

```markdown
# DNS / Cloudflare Change PR

## Scope
- Zone(s): [ ] elevationary.com  [ ] elevationary.ai
- Change summary (exact records/rules):

## Pre-flight
- [ ] TTLs reduced if needed (300s)
- [ ] Proxy state confirmed (orange cloud where required)
- [ ] Edge cert coverage verified or plan noted

## Commands to run (paste results)
```bash
dig +short elevationary.com
dig +short www.elevationary.com
dig +short agent.elevationary.com CNAME
Redirect rules (if any)
curl -I "https://elevationary.ai/foo?x=1" | sed -n '1,5p'
curl -I "https://www.elevationary.ai/bar?y=2" | sed -n '1,5p'
Risk & Rollback
	•	Risk: __________________
	•	Rollback plan: __________________
	•	Snapshot location (if used): /docs/dns-snapshots/*.txt

Post-merge checks
	•	Pages load with valid TLS
	•	HSTS still present (if enabled)
	•	Emails still deliver (if MX touched)
    ---

## How to enable it (super quick)
1) In VS Code, create the folder: `.github/` (and optionally `.github/PULL_REQUEST_TEMPLATE/`).
2) Add the markdown files above.
3) `git add .github && git commit -m "chore: add PR template(s)" && git push`.
4) (Optional) In GitHub → Settings → Branch protection (main), require PRs + 1 review so the template is actually used.

If you want me to tailor the template checklists even tighter around your Eleventy move later, say the word and I’ll ship a version with content/data-driven placeholders.c