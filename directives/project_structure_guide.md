# Elevationary Project Structure Standard

A clean file structure helps Agents understand context immediately.
Use this standard across all repositories.

## Root Directory

*Only for configuration and entry points.*

- `package.json`, `tsconfig.json` (Project config)
- `.env` (Secrets - gitignored, DO NOT COMMIT)
- `.env.example` (Template for secrets, commit this)
- `README.md` (Project entry point)
- `.gitignore`

## /src

*The actual application source code.*

- `*.js`, `*.ts` (Application logic)
- `components/`
- `lib/` or `utils/`

## /public

*Static assets served directly.*

- `robots.txt`
- `index.html` (if SPA root)
- `images/`

## /scripts

*Automation and maintenance scripts.*

- `smoke_test.sh`
- `deploy.sh`
- `setup.py`

## /docs

*Project management and human context.*

- `project_state.md` (Current Status snapshot)
- `session_log.md` (Running history)
- `backlog.md` (What are we doing next?)
- `decisions.md` (Why did we do it?)
- OPS-CHECKS.md
- `architecture.md`
- `logs/` (e.g. `training_log.md`)
- /brand_identity/

## /directives

*Agent instructions (The "Brain").*

- `Gemini.md` (Core rules)
- Agents.md
- brand_style.md
- Claude.md
- editor_profiles.md
- OpenAI.md
- `tech_stack.md`
- `knowledge_index.md`

## Why this helps the Agent:

1. **Search Scope:** When you ask "fix the build script", I look only in `/scripts`.
2. **Context Loading:** When I need business logic, I read `/docs`. I don't waste tokens reading your minified JS.
3. **Safety:** I know that editing `/docs` is safe, but editing `/src` requires testing.
