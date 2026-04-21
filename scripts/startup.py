import os
import sys
import subprocess

"""
Daily Agent Startup Routine (v2).
Initiates the session in this order:
1. Runtime Check (Self-Promotion)
2. TimeKeeper (Start Clock)
3. Safe Start (Git Status)
4. Reset Workbench (task.md)
5. Context Ingestion (Directives)
6. Local Hooks (post_startup.py)
7. Backlog Review & Import
"""

RUNTIME_PYTHON = os.path.expanduser("~/.gemini/antigravity/runtime/fleet_engine_venv/bin/python3")

def ensure_runtime():
    """Restarts the script with the optimized runtime if needed."""
    if os.path.exists(RUNTIME_PYTHON):
        current_exe = sys.executable
        # Simple check: are we running the good python?
        # Note: os.path.samefile removes symlink ambiguity
        try:
            if not os.path.samefile(current_exe, RUNTIME_PYTHON):
                print(f"⚡ Upgrading runtime to Python 3.10...")
                # Re-exec check
                # We need to pass the script path and any args
                # sys.argv[0] is the script
                args = [RUNTIME_PYTHON] + sys.argv
                os.execv(RUNTIME_PYTHON, args)
        except Exception as e:
            print(f"⚠️  Runtime upgrade check failed: {e}")



# Configuration
# Intelligent Root Detection
current_dir = os.getcwd()
WORKSPACE_DIR = current_dir

# Traverse up to find a "docs" folder that contains "BACKLOG.md"
# OR check for other root indicators like ".git" or "directives"
for _ in range(3): # Check up to 3 levels up
    if os.path.exists(os.path.join(current_dir, "docs", "BACKLOG.md")):
        WORKSPACE_DIR = current_dir
        break
    current_dir = os.path.dirname(current_dir)
else:
    # Fallback to CWD if not found (validate_workspace will catch it)
    WORKSPACE_DIR = os.getcwd()

def validate_workspace():
    """
    Ensures the script is running from a valid Workspace Root.
    Returns True if valid, False (and prints error) if not.
    """
    # 1. Primary Check: docs/ exists?
    docs_path = os.path.join(WORKSPACE_DIR, "docs")
    state_path = os.path.join(docs_path, "BACKLOG.md")
    
    if os.path.exists(docs_path) and os.path.exists(state_path):
        return True
        
    # 2. Heuristic Recovery (Smart scan)
    print(f"❌ INVALID EXECUTION DIRECTORY: {WORKSPACE_DIR}")
    print("   'startup.py' must be run from the Root of an Agent Workspace.")
    
    # Check Parent
    parent_dir = os.path.dirname(WORKSPACE_DIR)
    if os.path.exists(os.path.join(parent_dir, "docs", "BACKLOG.md")):
        print(f"\n💡 Did you mean to run this from the parent directory?")
        print(f"   👉 TRY THIS:  cd \"{parent_dir}\" && python3 startup.py")
        sys.exit(1)
        
    # Check Children (Immediate subdirs)
    try:
        subdirs = [d for d in os.listdir(WORKSPACE_DIR) if os.path.isdir(os.path.join(WORKSPACE_DIR, d))]
        for d in subdirs:
            potential_root = os.path.join(WORKSPACE_DIR, d)
            if os.path.exists(os.path.join(potential_root, "docs", "BACKLOG.md")):
                print(f"\n💡 Found a valid workspace in subdirectory '{d}':")
                print(f"   👉 TRY THIS:  cd \"{d}\" && python3 startup.py")
                sys.exit(1)
    except:
        pass
        
    print("\n⚠️  Could not detect a valid workspace nearby.")
    print("   Please 'cd' to your Agent's root folder (containing 'docs/') and try again.")
    sys.exit(1)

# Workspace_Valid = validate_workspace() # Moved to main() for testability

# Helper to re-calculate paths
def update_paths():
    global DOCS_DIR, BACKLOG_PATH, TASK_PATH
    DOCS_DIR = os.path.join(WORKSPACE_DIR, "docs")
    BACKLOG_PATH = os.path.join(DOCS_DIR, "BACKLOG.md")
    TASK_PATH = os.path.join(DOCS_DIR, "task.md")

update_paths()

SKILLS_DIR = os.path.expanduser("~/.gemini/antigravity/skills")
TIME_KEEPER_SCRIPT = os.path.join(SKILLS_DIR, "time_keeper", "scripts", "time_keeper.py")
POST_STARTUP_HOOK = os.path.join(WORKSPACE_DIR, "scripts", "post_startup.py")

def print_header(title):
    print(f"\n{'='*60}")
    print(f" {title}")
    print(f"{'='*60}")
    print("CRITICAL: task.md IS EPHEMERAL.")
    print("TRUST docs/SESSION_LOG.md AND docs/BACKLOG.md ONLY.")
    print(f"{'='*60}")

def run_cmd(cmd, cwd=WORKSPACE_DIR, ignore_error=False, capture=False):
    """Runs a shell command."""
    try:
        if capture:
            return subprocess.run(cmd, shell=True, check=True, cwd=cwd, capture_output=True, text=True).stdout
        else:
            subprocess.run(cmd, shell=True, check=True, cwd=cwd)
            return None
    except subprocess.CalledProcessError as e:
        if not ignore_error:
            print(f"   ❌ Failed: {e}")
        return None

def check_git_status():
    """Warns if git is dirty."""
    print(f"\n>> SAFE START CHECK (Git)")
    try:
        result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True, cwd=WORKSPACE_DIR)
        if result.stdout.strip():
            print("⚠️  WARNING: You have uncommitted changes from a previous session.")
            print("   It is recommended to start with a clean slate.")
        else:
            print("✅ Working tree clean.")
    except Exception:
        pass

def reset_workbench(task_path=None):
    """Wipes task.md to ensure no stale context."""
    target_path = task_path if task_path else TASK_PATH
    
    # Ensure directory exists (if using default DOCS_DIR)
    # If custom path, assume user knows what they are doing or handle error
    if not task_path and not os.path.exists(DOCS_DIR):
        try: os.makedirs(DOCS_DIR)
        except: pass
            
    try:
        with open(target_path, "w") as f:
            f.write("# Task Workbench\n\n- [ ] **PROTOCOL ZERO:** Read directives/Gemini.md immediately. <!-- id: p0 -->\n- [ ] Session Start <!-- id: 0 -->\n")
        print(f"\n🧹 task.md wiped & reset: {target_path}")
    except Exception as e:
        print(f"⚠️  Failed to reset task.md: {e}")

def check_directives():
    """Checks and INGESTS critical directives."""
    directives_dir = os.path.join(WORKSPACE_DIR, "directives")
    target_files = ["Gemini.md", "Agents.md", "SOW.md"]
    found_any = False
    
    if os.path.exists(directives_dir):
        print(f"\n>> DIRECTIVE INGESTION")
        for filename in target_files:
            file_path = os.path.join(directives_dir, filename)
            if os.path.exists(file_path):
                found_any = True
                print(f"📜 Reading {filename}...")
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        print(f"{'='*60}\n{f.read().strip()}\n{'='*60}\n")
                except Exception: pass

import argparse

# ... existing imports ...

import datetime
import re

# Add scripts dir to path to use state_manager
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(SCRIPT_DIR) # Should work as state_manager is in same dir

from state_manager import StateManager

def manage_backlog(import_mode=None, task_path=None):
    """Displays backlog and offers to import items. Filters by Date/Day."""
    sm = StateManager(WORKSPACE_DIR, task_path=task_path)
    
    # Use StateManager's intelligent filter
    # Get more than needed (top 10) to show options, but filter logic is centralized there
    valid_items = sm.get_next_tasks(limit=10)

    if not valid_items:
        print("\n>> BACKLOG REVIEW")
        print("   No actionable items in BACKLOG.md for today.")
        return

    print("\n>> BACKLOG REVIEW")
    print(f"   Found {len(valid_items)} actionable items.")
    for i, line in enumerate(valid_items[:5]): # Show top 5
        print(f"   {i+1}. {line}")
    if len(valid_items) > 5: print("   ...")

    if import_mode:
         choice = import_mode
         print(f"\n   Import top items? (Auto: {choice})")
    else:
         choice = input(f"\n   Import top items to task.md? (all/3/1/none): ").strip().lower()
    
    count = 0
    if choice == 'all': count = len(valid_items)
    elif choice == '3': count = 3
    elif choice == '1': count = 1
    elif choice == 'none': count = 0
    
    if count > 0:
        to_import = valid_items[:count]
        
        target_paths = set()
        if task_path:
            target_paths.add(task_path)
        target_paths.add(TASK_PATH)
        
        for path in target_paths:
            try:
                # Check if path exists or we can create it
                # If it's the brain task, it should exist. 
                # If it's the workspace task, it was just reset.
                with open(path, "a", encoding="utf-8") as f:
                    for item in to_import:
                        f.write(f"\n{item} <!-- imported -->")
                print(f"✅ Imported {count} items to: {path}")
            except Exception as e:
                print(f"⚠️  Failed to write to {path}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Daily Agent Startup Routine")
    parser.add_argument("--import-mode", "-i", choices=['all', '3', '1', 'none'], help="Auto-import backlog items (non-interactive)")
    parser.add_argument("--task-path", help="Explicit path to active task.md")
    
    args = parser.parse_args()
    
    ensure_runtime()
    
    # Validation (Moved from global scope)
    validate_workspace()
    
    print_header("🌅 DAILY STARTUP PROTOCOL (v2)")

    # 1. Start TimeKeeper (FIRST ORDER OF BUSINESS)
    print("\n>> TIMEKEEPER INIT")
    if os.path.exists(TIME_KEEPER_SCRIPT):
        # "START" is idempotent-ish (logs connection)
        run_cmd(f'"{sys.executable}" "{TIME_KEEPER_SCRIPT}" START')
    else:
        print(f"⚠️  TimeKeeper script not found.")

    # 2. Safety Check
    check_git_status()

    # 3. Reset Workbench
    reset_workbench(task_path=args.task_path)

    # 4. Ingest Context
    check_directives()

    # 5. Local Hooks (post_startup.py)
    # This is where Administrator runs Morning Briefing, etc.
    if os.path.exists(POST_STARTUP_HOOK):
        print("\n>> LOCAL STARTUP HOOK (post_startup.py)")
        print("-" * 30)
        run_cmd(f'"{sys.executable}" "{POST_STARTUP_HOOK}"')

    # 6. Backlog Interaction
    manage_backlog(import_mode=args.import_mode, task_path=args.task_path)

    print("\n✅ Muster Complete. Awaiting Orders.")

if __name__ == "__main__":
    main()
