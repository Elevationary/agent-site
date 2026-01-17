# Newsletter & Article Storage Strategy

**Status:** Approved
**Date:** 2026-01-14
**Context:** Handoff to "Archetype - Content" for production planning.

## 1. Executive Summary
To accommodate the projected high velocity of content generation (approx. 26,000 artifacts/year) while staying within the architectural limits of our static site host (Cloudflare Pages), we have adopted a **Hybrid Storage Strategy**:
1.  **"Hot" Content (0–9 Months):** Stored as static HTML files in the Git repository (`src/premium/`) and served via Cloudflare Pages.
2.  **"Cold" Content (9+ Months):** Offloaded to **Cloudflare R2** (Object Storage) to bypass build limits and reduce build times.

---

## 2. The Problem: Velocity vs. Limits

### The Velocity
*   **Production Rate:** 20 Newsletters/Day × 5 Stories/Newsletter = **100 Stories/Day**.
*   **Annual Volume:** 100 Stories × 260 Working Days = **26,000 Stories/Year**.

### The Constraint
*   **Cloudflare Pages Limit:** Hard limit of **20,000 files** per project build.
*   **Consequence:** Without an archival strategy, the build pipeline would fail irreversibly within the first 12 months of operation.

---

## 3. The Architecture: Rolling Window

We acknowledge that AI news has a high rate of decay. Information relevant today is often obsolete within 6–12 months. This reality allows us to treat older content as "Archive" rather than "Production."

### A. Hot Storage (The Live Site)
*   **Location:** `src/premium/{category}/{slug}.njk` (in this Git Repo).
*   **Mechanism:** Standard Eleventy Static Site Generation (SSG).
*   **Window:** Rolling **9–12 months** of recent content.
*   **Performance:** Fastest possible (Edge delivery, pre-rendered HTML).
*   **Access Control:** Protected by Cloudflare Middleware (`functions/_middleware.js`).

### B. Cold Storage (The Archive)
*   **Location:** Cloudflare R2 Bucket (e.g., `elevationary-archive`).
*   **Mechanism:** Direct object delivery or via a lightweight Worker.
*   **Trigger:** When content exceeds the 9-month window or total file count approaches 15,000 (75% of limit).
*   **Access Control:** Same Middleware logic can verify tokens before generating a signed URL for the R2 object.

---

## 4. Implementation Phasing

### Phase 1 & 2: "Just Build It"
*   **Strategy:** Use the simple folder structure (`src/premium/`).
*   **Reasoning:** We start at 0 files. It will take approx. 6–9 months to hit the "Danger Zone" (15k files).
*   **Action:** No complex engineering required immediately. Focus on content velocity.

### Phase 3: The Archival Script (Q3/Q4)
*   **Trigger:** When file count hits 10,000.
*   **Action:** Develop a script to:
    1.  Identify files older than 9 months.
    2.  Upload them to R2.
    3.  Delete them from the Git repo.
    4.  Update a central `archive-index.json` so the frontend knows where to find them.

## 5. Summary for Content Archetype
**You have the green light to generate content at full speed.**
Do not worry about storage limits. We have a defined "Rolling Window" strategy that treats content relevance as the primary filter for storage location. Generate files into `src/premium/` and operations will handle the archiving when necessary.
