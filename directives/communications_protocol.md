# Communications Protocol
> **Mission:** Ensure lossless transmission of intent from User to Execution Agent. Zero "Telephone Game" distortion.

## 1. The Hierarchy of Truth
We operate on a **3-Tier Pull Model**. Information is pushed down as **Orders**, but Status is pulled up as **State**.

| Level | Role | Responsibility | Artifact |
| :--- | :--- | :--- | :--- |
| **0** | **User** | The Source of Intent. | `notify_user` / Directives |
| **1** | **Administrator** | The Conductor. Orchestrates the Organization. | **Master Dashboard** (Traffic Light) |

| **2** | **Director** | The Section Leader. Translates Strategy. | **Division Dashboard** (Rollup) |
| **3** | **Manager** | The Musician. Executes Tasks. | **Project PD3** (Detail) |

## 2. Artifacts of Record

All projects must be grounded in these documents before execution begins.

### A. Requirement Documents (The Input)
*   **MRD (Marketing):** Market needs, customer definition, value prop.
*   **PRD (Product):** Features, user stories, functional requirements.
*   **ERD (Engineering):** Technical architecture, schema, stack decisions.

### B. The Outcomes Document (The Output)
*   **Type:** "Post-Partum" Analysis (Life, not Death).
*   **Purpose:** Audit actual results vs. initial expectations.
*   **Timing:** Created at project start (Goals) -> Updated at project end (Results).

### C. PD3 (The Living State)
**Project Definition 3** (Phases, Deliverables, Dependencies, Decisions).

**Format:** Google Sheet (`.gsheet`).
**Structure:**

**1. Metadata Header:**
*   Executive Sponsor, Owner, Program Manager, Project Manager, IT Lead, QA Lead.
*   Contact Emails.

**2. Timeline (Gantt):**
*   Visual "Phase vs. Week" matrix.

**3. The 4 D's (State Tables):**
*   **Phases:** `[✅] Phase Name | Start Date | End Date`
*   **Deliverables:** `[✅] Deliverable Name | Due Date`
*   **Decisions / Requests:** `[✅] Item | Owner | Due Date`
*   **Dependencies:** `[✅] Item | Owner | Due Date`

**4. Reporting:**
*   **Highlights:** Item | Date
*   **Lowlights:** Item | Date

**Status Legend:**
*   ✅ **Green:** Completed / On Plan.
*   🟧 **Amber:** Overdue < 2 weeks.
*   🟥 **Red:** Overdue > 2 weeks.
*   🔲 **Square:** PD3 Due.

**The "Lite" Variant:**
For tasks <15 minutes: A simplified, single-row entry in the Project PD3 (Concept TBD).

## 3. The "Traffic Light" Protocol

We manage by **Exception**, not interrogation.

*   🟢 **GREEN:** "On Plan." No attention needed.
*   🟡 **AMBER:** "Risk Detected." Director investigates.
*   🔴 **RED:** "Blocked / Failed." Administrator/User intervention required.

**The Rollup Logic:**
*   Project PD3 (Level 3) updates → Director Dashboard (Level 2) reflects status.
*   Director Dashboard (Level 2) updates → Master Dashboard (Level 1) reflects status.
*   **Rule:** A single Red item at Level 3 turns the Level 2 indicator Red.

## 4. Verification Handshake

Every Order must be verified upon receipt.
1.  **Receive:** Agent reads `BACKLOG.md` or Directive.
2.  **Reflect:** Agent summarizes understand in `session_log.md`.
3.  **Execute:** Agent updates PD3 State.
