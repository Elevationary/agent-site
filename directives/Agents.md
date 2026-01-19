# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, OPENAI.md, and GEMINI.md so the same instructions load in any AI environment.
> **CRITICAL:** If you edit `Gemini.md`, you MUST immediately execute `cp Gemini.md Agents.md; cp Gemini.md Claude.md; cp Gemini.md OpenAI.md` to keep the brains synchronized.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- Basically just SOPs written in Markdown, live in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Your job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `directives/scrape_website.md` and come up with inputs/outputs and then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**
- Deterministic Python scripts in `execution/`
- Environment variables, api tokens, etc are stored in `.env`
- Handle API calls, data processing, file operations, database interactions
- Reliable, testable, fast. Use scripts instead of manual work. Commented well.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

## Operating Principles

**1. Check for tools first**
Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**Global Toolkit:**
- **Timekeeper:** `python3 ~/.gemini/antigravity/skills/time_keeper/scripts/time_keeper.py [START|STOP]`
- **PDF Reader:** `python3 ~/.gemini/antigravity/skills/pdf_reader/scripts/read_pdf.py <path_to_pdf>`
- **Google Workspace:** `~/.gemini/antigravity/skills/google_workspace/scripts/`
    - **Drive:** `.../drive_list.py [query]` | `.../drive_delete.py <ID>`
    - **Docs:** `.../doc_read.py <ID>` | `.../doc_create.py "Title" "Content"` | `.../doc_replace.py <ID> "Old" "New"`
    - **Sheets:** `.../sheet_read.py <ID> [Range]` | `.../sheet_append.py <ID> "CSV"` | `.../sheet_update.py <ID> <Range> "CSV"`
    - **Slides:** `.../slide_read.py <ID>` | `.../slide_create.py "Title"`

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)
- Update the directive with what you learned (API limits, timing, edge cases)
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**Operations requiring user approval before execution:**
- Paid API calls (tokens, credits, etc.)
- Long-running scripts (>5 minutes estimated runtime)
- Scripts that modify production data
- Scripts that send emails or notifications
- Any operation with significant business impact

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

**Clarification on directive creation:** If the user asks you to "set up a workflow for X" or similar task-oriented requests, you have implicit permission to create the corresponding directive (e.g., `directives/scrape_website.md`).

## Self-annealing loop

Errors are learning opportunities. When something breaks:
1. Fix it
2. Update the tool
3. Test tool, make sure it works
4. Update directive to include new flow
5. System is now stronger

## File Organization

**Deliverables vs Intermediates:**
- **Deliverables**: Google Sheets, Google Slides, or other cloud-based outputs that the user can access
- **Intermediates**: Temporary files needed during processing

**Directory structure:**
- `.tmp/` - All intermediate files (dossiers, scraped data, temp exports). Never commit, always regenerated.
- `execution/` - Python scripts (the deterministic tools)
- `directives/` - SOPs in Markdown (the instruction set)
- `.env` - Environment variables and API keys
- `credentials.json`, `token.json` - Google OAuth credentials (required files, in `.gitignore`)

**Key principle:** **Business Data Deliverables** (reports, datasets) should generally live in cloud services (Google Sheets, Slides) for easy user access. **Engineering Deliverables** (source code, text files, documentation) live in the local repository. Intermediate processing files live in `.tmp/`.

**Temp file management:** Use your judgment on when to create and clean up `.tmp/` files. Generally, clean up when a task is complete. You may organize by directive (e.g., `.tmp/scrape_website/`) if it helps maintain clarity.

**Missing credentials:** 
1. **Check Environment First:** Look for `GOOGLE_CLIENT_SECRETS_JSON` or `GOOGLE_TOKEN_JSON` in `.env`. If present, parse them using `json.loads()`.
2. **Check Files Second:** If not in `.env`, look for `credentials.json` or `token.json` (gitignored).
3. **If Missing:** Halt and ask the user to provide them.

## Context Persistence & Session Management

To ensure long-term memory and reliability, you must actively manage the "State Files" in `docs/`.

> **CRITICAL:** Do NOT create `docs/task.md`. Use `docs/BACKLOG.md` for project scope and your internal memory (`task_boundary`) for session tactics.

**1. On Startup (The Morning Muster):**
- **Protocol:** Run `python3 startup.py` immediately.
- **Results:** This will display your Directives status, the MOTD, and automatically START the timekeeper.
- **Context:** Then read `docs/project_state.md` and `docs/BACKLOG.md`.

**2. On Wrap-up (The Handover):**
- **Knowledge:** "Did I learn something new?" -> Update the relevant `directives/` file.
- **Hygiene:** Delete/Archive files in `.tmp/`.
- **Clock:** Execute `python3 ~/.gemini/antigravity/skills/time_keeper/scripts/time_keeper.py STOP` and report the Stats ("Session Duration", "Daily Total").
- **State:** Update `docs/project_state.md` (Current Status) and append to `docs/session_log.md` (Session Summary).
- **The Law of Logs:** You are one of many. Your memory implies the next agent's success. **Be Disciplined.** Detailed logs allow us to switch contexts between 8+ workspaces without losing flow.
- **Do not ask for permission** to update these logs; treat them as your own internal memory.

## Summary

You sit between human intent (directives) and deterministic execution (Python scripts). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

Be pragmatic. Be reliable. Self-anneal.
