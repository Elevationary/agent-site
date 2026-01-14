# Archetype: Web Platform (The Revenue Engine)
*Standard configuration for Elevationary's Commerce & Content platforms.*

## 1. Core Identity
*   **Purpose:** Traffic -> Content -> Conversion (Commerce).
*   **Differentiator:** Not a passive "brochure" (Consulting) nor a complex "app" (SaaS). It is a Transactional Content Engine.

## 2. Technology Stack
*   **Engine:** Eleventy (11ty) - Static, Secure, Fast.
*   **Edge:** Cloudflare Pages + Access (Gating).
*   **Commerce:**
    *   **Stripe:** Payments & Subscriptions.
    *   **ACP/UCP:** Agent-readable manifests for AI Commerce.
*   **Growth:**
    *   **HubSpot:** CRM & Forms.
    *   **Apollo/Instantly:** Outbound Lead Gen. (External).

## 3. Directory Structure
*   `src/`: Source code (Nunjucks templates, styles).
*   `content/`: Markdown content (Newsletters, Products).
*   `_data/`: Global JSON data (Site config, external APIs).
*   `public/.well-known/`: AI Protocols (ACP).

## 4. AI Visibility (Mandatory)
*   **Robots:** Open to `GPTBot`, `CCBot`.
*   **Identity:** Global `Organization` Schema.
*   **Commerce:** `ai-plugin.json` present.
