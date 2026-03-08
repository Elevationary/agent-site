# Global Skill Documentation Standard

**Authority:** Administrator (Director of Operations)
**Applicability:** All Agents publishing Global Skills.

## The Mandate
If you publish a Global Skill to `~/.gemini/antigravity/skills/`, it **MUST** be fully documented. An undocumented skill is "Dark Logic"—it is unmaintainable, undiscoverable, and therefore effectively does not exist.

## Requirements

Every Global Skill folder (e.g., `skills/my_new_skill/`) must contain:

### 1. The Manifest (`SKILL.md`)
This file is the **entry point** for other agents. It must contain:
*   **YAML Frontmatter:**
    ```yaml
    ---
    name: [skill_name]
    description: [One line summary]
    version: 1.0.0
    ---
    ```
*   **Capabilities:** specific bullet points of what it does.
*   **Usage:** Exact command-line examples (e.g., `python3 scripts/run.py ...`).
*   **Dependencies:** Any libraries required in the global environment.

### 2. The Scripts Directory (`scripts/`)
All executable Python code must live in `scripts/`. Do not place loose scripts in the root of the skill folder.

## Enforcement
*   The **Corporate Governance Audit** now scans for `SKILL.md`.
*   Any skill found without this manifest will be flagged as **DRIFT** in the Morning Briefing.
*   Repeated violations will result in the removal of the undocumented skill.

## Example Structure
```text
~/.gemini/antigravity/skills/
└── weather_forecaster/
    ├── SKILL.md            <-- REQUIRED
    └── scripts/
        └── get_forecast.py
```

> **Last Modified:** 2026-02-18
