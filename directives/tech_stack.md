# Tech Stack & Ecosystem
*The integrated toolchain for the Elevationary Platform.*

## Core Platform (The Microsite)
- **Engine:** [Eleventy (11ty)](https://www.11ty.dev/) (Static Site Generator).
- **Hosting:** **Cloudflare Pages** (Edge delivery).
- **Security:** **Cloudflare Access** (Gating content).
- **Frontend:** HTML5, Nunjucks (.njk), Vanilla CSS.

## The Ecosystem
### 1. Customer Relationship (CRM)
- **HubSpot:** The Source of Truth for *People*.
    - Manages: Subscribers, Opt-outs, Newsletter Delivery.
    - Integration: Receives data from Stripe and Instantly.

### 2. Commerce & Gating
- **Stripe:** The Source of Truth for *Revenue*.
    - Manages: Subscriptions, Payments.
    - Integration: Gates content relative to subscription status.

### 3. Growth Engine (Outbound)
- **Instantly.ai:** Cold Email Infrastructure.
    - Assets: 25+ Warmed Domains.
    - Scale: 20k emails/month.
    - Logic: Stops sending upon HubSpot "Subscribed" signal.
- **Data Source:** Apollo.io + Agentic Enrichment.

### 4. Brand Presence
- **Google Sites:** Primary domain (Education/Info). Links to Microsite for interaction.

## Standards & Protocols (AI Commerce)
- **ACP (Agentic Commerce Protocol):** `ai-plugin.json` for OpenAI/LangChain agents.
- **UCP (Universal Commerce Protocol):** Standardized commerce manifests.
- **Schema.org:** JSON-LD for `Organization` (Identity), `Product` (Commerce), and `FAQPage` (AEO).

## Coding Standards (Microsite)
1.  **Static Speed:** All content pre-rendered to `_site`.
2.  **Embedded Forms:** Use `src/_includes/hubspot-form.njk` for logic-free integration.
3.  **Link Strategy:** Always link "Rich Stories" back to original source for SEO/Credibility.
