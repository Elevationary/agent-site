# Modernized Protocol Guide 🌅 / 🌙

A unified framework for starting and ending agent sessions.

## 🌅 Startup (`startup`)

Run this to begin your day.
**Command:** `startup` (after sourcing `~/.zshrc`) or `.../startup.py`

**Order of Operations:**

1. **⏱️ TimeKeeper**: Starts the clock (Priority #1).
2. **🛡️ Safe Start**: Warns if Git has uncommitted changes.
3. **🧹 Reset Workbench**: Wipes `docs/task.md` for a fresh start.
4. **🧠 Context Ingestion**: Reads Directives and `project_state.md`.
5. **⚡ Local Hooks**: Runs your workspace's `scripts/post_startup.py` (if it exists).
   - *Admin*: Runs Morning Briefing, Dispatcher, Audits.
6. **📝 Backlog**: Offers to pull top items from `docs/BACKLOG.md` to your workbench.

## 🌙 Shutdown (`wrapup`)

Run this to end your day.
**Command:** `wrapup` (after sourcing `~/.zshrc`) or `.../shutdown.py`
*Note: We use `wrapup` to avoid conflict with the system `shutdown` command.*

**Order of Operations:**

1. **⚡ Local Hooks**: Runs your workspace's `scripts/pre_shutdown.py` (if it exists).
   - *Admin*: Dispatches Recordings, Syncs Secrets.
2. **📝 Session Log**: Appends accomplished tasks to `docs/SESSION_LOG.md`.
3. **💾 Project State**: Offers to update `docs/project_state.md`.
4. **🧹 Backlog**: Offers to return pending tasks to `docs/BACKLOG.md`.
5. **🧹 Workbench Cleanup**: Wipes `docs/task.md`.
6. **🛡️ Safety Check**: Warns if Git has uncommitted changes.
7. **⏱️ TimeKeeper**: Stops the clock (Last Action).

## ⚡ Shortcuts

I have added the following aliases to your `~/.zshrc`:

- `startup` = Runs the Daily Startup Protocol.
- `wrapup` = Runs the Daily Shutdown Protocol.

**To activate them, please run:**

```bash
source ~/.zshrc
```
