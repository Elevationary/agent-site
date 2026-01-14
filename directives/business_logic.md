# Business Logic: Elevationary Revenue Platform
*The Ecosystem for Content, Traffic, and Conversion.*

## 1. Project Identity
*   **Role:** The "Revenue Engine" (Microsite).
*   **Core Function:** Convert traffic into subscribers via high-value content.
*   **Relationship:** Complements the main brand site (`Elevationary.ai` on Google Sites).

## 2. The Newsletter Strategy
*   **Concept:** 20 Department-Specific Topics (e.g., Finance, HR, Comms).
*   **Content Model:**
    *   **AI Generated:** Agents scrape/summarize daily news.
    *   **The Hook:** Short summaries delivered via email.
    *   **The Value:** "Read Full Story" links to the **Microsite** (Rich Story).
    *   **Credibility:** Rich Story links to original reputable sources.
*   **Freemium Model:**
    *   **Free:** 1-year subscription for first 1000 users (Warm Leads).
    *   **Paid:** Subscribers get access to "Rich Stories" on the Microsite.

## 3. Lead Generation Workflow
A closed-loop system for acquiring and managing subscribers.

### A. Sources
*   **Warm Leads (2,500):** Existing network. Upload to HubSpot -> Invite to Free Sub.
*   **Cold Leads (Expansion):** Sourced via Apollo + Agent Enrichment.
    *   **Tool:** **Instantly.ai** (25+ Warmed Domains).
    *   **Volume:** ~20,000 emails/month.
    *   **Offer:** "Try Elevationary" (Free Subscription).

### B. The Flow (The Machine)
1.  **Outreach:** Instantly.ai sends email.
2.  **Conversion:** User clicks "Subscribe" -> Redirects to Microsite/Stripe.
3.  **Payment/Auth:**
    *   **Stripe:** Collects info & payment (Source of Rev Truth).
    *   **Cloudflare:** Gates access to content based on Sub status.
4.  **Fulfillment:**
    *   Stripe notifies **HubSpot** (Source of Subscriber Truth).
    *   HubSpot takes over daily newsletter delivery.
    *   Instantly.ai is notified to **STOP** marketing (Move from Prospect to Customer).

### C. Feedback Loops
*   **Opt-Outs:** If User unsubscribes in Instantly -> Push to HubSpot "Do Not Contact" list (Compliance).

## 4. Enterprise Architecture
*   **The Billboard:** **Google Sites** (Main Brand). Simple, static information.
*   **The Machine:** **Microsite** (This Projects). Hosted on **Cloudflare**.
    *   **Why?** Google Sites is too limited. Microsite handles Stripe/HubSpot/Security.
    *   **Security:** Cloudflare + Stripe ensure only paid subscribers view "Rich Stories".

## 5. AI Awareness Strategy (GEO/AEO)
*   **Goal:** Be the definitive "Answer" for AI/Financial queries.
*   **Tactics:**
    *   **Visibility:** Allow `GPTBot` (OpenAI) and other AI scrapers.
    *   **Commerce:** Enable agents to buy directly via ACP/UCP protocols.
    *   **Authority:** Structure data so AI "knows" who Elevationary is (Entity Graph).

## 6. Success Metrics
*   **Conversion:** Target 1% of Cold Outreach (200 subs/month).
*   **Retention:** Measured by HubSpot engagement.
