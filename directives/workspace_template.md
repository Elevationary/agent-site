# Elevationary Workspace Template Specification

When creating a new workspace, use this blueprint to ensure consistency.

## 1. Directory Structure (Skeleton)
Create these empty folders immediately:
```text
/
├── .env (gitignored)
├── directives/
├── docs/
├── execution/
├── public/
├── scripts/
├── src/
├── tmp/
└── README.md
```

## 2. Core Directives (`/directives`)
Copy these files into every new workspace. They form the Agent's "Brain".

1.  **`knowledge_index.md`** (The Entry Point)
    *   *Why:* Tells the agent where to look.
2.  **`project_structure_guide.md`** (The Map)
    *   *Why:* Enforces the `src/` vs `docs/` structure.
3.  **`Gemini.md` (and mirrors `Claude.md`, `Agents.md`)** (The Constitution)
    *   *Why:* Defines the 3-layer architecture and rules of engagement.
4.  **`tech_stack.md`**
    *   *Why:* Enforces TypeScript/Tailwind defaults.
5.  **`business_logic.md`**
    *   *Why:* Template for domain rules (Start with generic Elevationary context).
6.  **`import_chatgpt.md`** (Blank Template)
    *   *Why:* **Critical.** Provides the standard slot for user memory/history.

## 3. Recommended Root Files
1.  **`.gitignore`** (Standard Node/Python ignore)
2.  **`.cursorrules`** (If using Cursor, can import rules from `Gemini.md`)
3.  **`package.json`** (If JS/TS project - can be initialized later)

## 4. Documentation Templates (`/docs`)
1.  **`backlog.md`** (Empty checklist)
2.  **`decisions.md`** (Decision Log template)
