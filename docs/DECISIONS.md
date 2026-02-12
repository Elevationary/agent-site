# Architecture Decision Records (ADR)

## Active Decisions

### ADR-008 — Lean Stack Architecture (HubSpot Removal) (2026-01-21)
**Context**: HubSpot pricing tiers ($1,450/mo for required features) breaks the business model. We need a low-cost, high-scale alternative.
**Decision**: Remove HubSpot. Adopt "Lean Stack":
- **Identity & Revenue**: **Stripe** (Customer Object + Subscriptions).
- **Outreach**: **Instantly.ai** (Cold Lead Gen).
- **Registry**: **Cloudflare D1** (or Stripe Metadata) to bridge Identity and Access.
- **Benefits**: Drastic cost reduction, simplified data flow.
**Status**: Accepted.

### ADR-007 — Freemium Content Strategy & Gating (2026-01-05)
**Context**: We need to monetize deep-dive content while maintaining broad reach with the "3-2-1" newsletter format.
**Decision**: Implement a "Free to Browse, Paid to Deep Dive" model.
- **Hosted Content**: All newsletters (free "3-2-1" and paid "Full Story") are hosted on the microsite (Eleventy + Cloudflare Pages).
- **The Gatekeeper**: Use **Cloudflare Workers** to enforce access control.
    - Check user status via cookie/token (Stripe Session or JWT).
    - If valid subscriber -> Serve full content.
    - If non-subscriber -> Redirect to "Unlock/Subscribe" landing page.
**Status**: Accepted.

### ADR-006 — HubSpot as Identity Source of Truth (2026-01-05)
**Status**: **SUPERSEDED** by ADR-008.
**Context**: Originally planned to use HubSpot as the master CRM.
**Outcome**: Cost prohibitive ($1,450/mo) for required features. HubSpot removed from architecture.


### ADR-005 — Email Routing for .ai (2025-10-24)
**Decision**: Use Cloudflare Email Routing for `@elevationary.ai` forwarding to `@elevationary.com`.
**Why**: Simplify forwarding; consistent SPF/DKIM/DMARC posture.
**Status**: Completed.

### ADR-004 — DNS Provider Consolidation (2025-10-24)
**Decision**: Centralize `elevationary.com` and `elevationary.ai` DNS on Cloudflare.
**Why**: Unified control for Pages, Workers, and Security.
**Status**: Completed.

### ADR-003 — Change Control Posture (2025-10-24)
**Decision**: Permit direct-to-main commits during foundation work.
**Why**: Velocity during early build phase.
**Status**: Accepted.

### ADR-002 — Agent Micro-site Strategy (2025-10-24)
**Decision**: Host agent/AEO pages on Cloudflare Pages (`agent.elevationary.com`).
**Why**: Bypasses Google Sites limitations (scripts, APIs, gating); keeps human UX separate.
**Status**: Accepted.

### ADR-001 — HSTS Scope (2025-10-24)
**Decision**: Enable HSTS max-age 30d.
**Why**: Baseline security.
**Status**: Accepted.
