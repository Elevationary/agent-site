# Implementation Plan: Archetype - Web Platform
**Goal:** Define and implement the "Web Platform Archetype" (v1) for the Elevationary Revenue Generating Site (`agent-site`).

## User Review Required
> [!IMPORTANT]
> **Archetype Definition:** This archetype is distinct from "SaaS" (Application) and "Consulting" (Documents). It is defined as a **Revenue Engine**:
> *   **Core:** Static Site Generator (Eleventy) for speed/SEO.
> *   **Commerce:** Stripe (Payments/Subscriptions).
> *   **Growth:** HubSpot (CRM) & YouTube (Content).
> *   **Delivery:** Cloudflare (Edge/Security).

## Proposed Changes

### 1. Archetype Definition Files (The Specification)
We will create `directives/archetype_platform.md` to define:
*   **Structure:** `src/` (Code), `content/` (Markdown), `infrastructure/` (Workers).
*   **Tech Stack:** Eleventy, TailwindCSS, Stripe.js, Cloudflare Pages.
*   **Business Logic:** "Revenue Engine" (Traffic -> Subscriber -> Consultation/Product).

### 2. Workspace Refactoring (The Migration)
We will align `micro-site/agent-site` with the new Archetype:
*   **Update Tech Stack:** Rewrite `directives/tech_stack.md` to reflect **Eleventy** (removing generic React/Next.js references).
*   **Update Business Logic:** Rewrite `directives/business_logic.md` to focus on Subscription/Commerce goals.
*   **Structure:** Ensure `src/` and `_site` are properly handled in `.gitignore` and `project_structure_guide.md`.

### 4. AI Visibility Layer (The "Smart" Upgrade)
*   **AEO/GEO:** Implement global `Organization` schema and `FAQPage` schema strategies.
*   **Protocols:**
    *   **ACP:** Create `ai-plugin.json` for Agentic Commerce.
    *   **UCP:** Define Commerce Manifests.
*   **Access:** Fix `robots.txt` to Allow `GPTBot` (Critical).

### 5. Agent Configuration
*   **Directives:** Copy latest `Gemini.md` and `Agents.md` from Basecamp.
*   **Environment:** Ensure `.env` has placeholders for `STRIPE_KEY`, `HUBSPOT_KEY`, `CLOUDFLARE_TOKEN`.

## Verification Plan
1.  **Build Test:** Run `npm run build` to confirm Eleventy site generates without error.
2.  **Logic Check:** Verify `directives/business_logic.md` accurately describes the Platform goals.
