import os
import sys
import subprocess
import argparse
import json
import urllib.request

# Add scripts dir to path to find state_manager
sys.path.append(os.path.join(os.path.dirname(__file__)))
from state_manager import StateManager

# Configuration
WORKSPACE_DIR = os.getcwd()
PRE_SHUTDOWN_HOOK = os.path.join(WORKSPACE_DIR, "scripts", "pre_shutdown.py")
SKILLS_DIR = os.path.expanduser("~/.gemini/antigravity/skills")
TIME_KEEPER_SCRIPT = os.path.join(SKILLS_DIR, "time_keeper", "scripts", "time_keeper.py")

def print_header(title):
    print(f"\n{'='*60}")
    print(f" {title}")
    print(f"{'='*60}")

def run_cmd(cmd, cwd=WORKSPACE_DIR):
    try:
        subprocess.run(cmd, shell=True, check=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Failed: {e}")

def wipe_workbench(task_path):
    """Resets task.md."""
    try:
        with open(task_path, "w") as f:
            f.write("# Task Workbench\n\n- [ ] Session Start <!-- id: 0 -->\n")
        print(f"✅ task.md wiped.")
    except Exception as e:
        print(f"⚠️  Failed to reset task.md: {e}")

def auto_diff_scribe():
    """Captures uncommitted git changes and uses Gemini to summarize achievements."""
    print("   🤖 Auto-Diff Scribe: Analyzing physical repository changes...")
    
    try:
        # We need to see untracked files as well, so add them as intent-to-add silently
        subprocess.run("git add -N .", shell=True, check=True, cwd=WORKSPACE_DIR, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
        
        # Grab strictly uncommitted changes currently in the working tree
        result = subprocess.run("git diff HEAD", shell=True, capture_output=True, text=True, cwd=WORKSPACE_DIR)
        uncommitted_diff = result.stdout.strip()
        
        # Grab all commits made today (since midnight) to catch mid-session manual commits
        log_result = subprocess.run('git log -p --since="midnight" --no-merges', shell=True, capture_output=True, text=True, cwd=WORKSPACE_DIR)
        committed_diff = log_result.stdout.strip()
        
        diff_text = f"{committed_diff}\n\n{uncommitted_diff}".strip()
        
    except Exception as e:
        print(f"   ⚠️  Git diff failed: {e}")
        return []
        
    if not diff_text:
        print("   ℹ️  No changes detected in Git. Skipping Diff Scribe.")
        return []

    # Truncate diff if too large (roughly ~30k chars for standard REST limits)
    if len(diff_text) > 30000:
        diff_text = diff_text[:30000] + "\n... [diff truncated]"

    # Find API Key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        env_path = os.path.join(WORKSPACE_DIR, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r") as f:
                for line in f:
                    if line.startswith("GEMINI_API_KEY="):
                        api_key = line.strip().split("=", 1)[1].strip().strip('"').strip("'")
                        break
                        
    if not api_key:
        print("   ⚠️  GEMINI_API_KEY not found in env. Skipping Auto-Diff Scribe.")
        return []
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    prompt = f"You are an expert technical project manager compiling a changelog. Analyze this raw git diff of the work completed during this coding session. Summarize the accomplishments into a concise, professional bulleted list (Max 5 bullets). Focus on high-level achievements, phrased dynamically and firmly in the past tense.\n\nGIT DIFF:\n{diff_text}"
    
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "systemInstruction": {"parts": [{"text": "Format your response exactly as bullet points starting with '- ' (no markdown headers, no introductory text, no bolded category names unless absolutely necessary)."}]},
        "generationConfig": {"temperature": 0.2}
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as response:
            resp_data = json.loads(response.read().decode("utf-8"))
            text = resp_data["candidates"][0]["content"]["parts"][0]["text"]
            lines = text.strip().split('\n')
            
            # Clean up the returned bullets and append the tag so the user knows it was auto-generated
            achievements = []
            for line in lines:
                clean_line = line.strip().lstrip("-* \t").strip()
                if clean_line:
                    # Strip annoying markdown bold artifacts if Gemini disobeys instructions
                    clean_line = clean_line.replace("**", "")
                    achievements.append(f"{clean_line} (Auto-Analyzed by diff)")
            
            if achievements:
                print(f"   ✨ Synthesized {len(achievements)} dynamic achievements.")
            return achievements
            
    except Exception as e:
        print(f"   ⚠️  Gemini API call failed: {e}")
        return []

def manage_git_status(auto_commit=False, commit_msg=None, auto_yes=False, auto_achievements=None):
    """Checks git status and offers to commit."""
    print(f"\n>> GIT STATUS CHECK")
    if not os.path.exists(os.path.join(WORKSPACE_DIR, ".git")):
        return 
    try:
        result = subprocess.run("git status --porcelain", shell=True, capture_output=True, text=True, cwd=WORKSPACE_DIR)
        if result.stdout.strip():
            print("⚠️  WARNING: You have uncommitted changes!")
            if auto_commit:
                choice = 'y'
            elif auto_yes:
                choice = 'n'
            else:
                choice = input("   Do you want to Commit these changes now? (y/N): ").strip().lower()
                
            if choice == 'y':
                if commit_msg:
                    msg = commit_msg
                else:
                    # Use auto-achievements to generate a smart default commit message
                    if auto_achievements:
                        smart_msg = auto_achievements[0].replace(' (Auto-Analyzed by diff)', '')
                        msg = input(f"   Enter Commit Message [{smart_msg}]: ").strip()
                        if not msg: msg = smart_msg
                    else:
                        msg = input("   Enter Commit Message: ").strip()
                        if not msg: msg = "Session Auto-Commit"
                
                print("   💾 Saving...")
                try:
                    subprocess.run("git add .", shell=True, check=True, cwd=WORKSPACE_DIR)
                    subprocess.run(f'git commit -m "{msg}"', shell=True, check=True, cwd=WORKSPACE_DIR)
                    print("   ✅ Changes Committed.")
                except Exception as e:
                    print(f"   ❌ Commit Failed: {e}")
            else:
                 if not auto_yes:
                    input("   Press ENTER to acknowledge and continue shutdown...")
                 else:
                    print("⏩ Keeping changes uncommitted.")
        else:
            print("✅ Working tree clean.")
    except Exception as e:
        print(f"⚠️  Git check failed: {e}")

def main():
    parser = argparse.ArgumentParser(description="Step 2: Intelligent Shutdown Protocol")
    parser.add_argument("--auto-yes", "-y", action="store_true", help="Auto-confirm prompts")
    parser.add_argument("--commit", "-c", action="store_true", help="Auto-commit git changes")
    parser.add_argument("--message", "-m", help="Commit message")
    parser.add_argument("--summary", "-s", help="Session log summary text")
    parser.add_argument("--task-path", help="Explicit path to active task.md")
    
    args = parser.parse_args()
    
    print_header("🌙 INTELLIGENT SHUTDOWN PROTOCOL (v4.1 Auto-Diff Edit)")

    # 1. Initialize State Manager
    sm = StateManager(WORKSPACE_DIR, task_path=args.task_path)

    # 2. Local Hooks
    if os.path.exists(PRE_SHUTDOWN_HOOK):
        print("\n>> LOCAL HOOKS (pre_shutdown.py)")
        print("-" * 30)
        run_cmd(f'"{sys.executable}" "{PRE_SHUTDOWN_HOOK}"')
    
    # 3. Analyze Session
    done_items = sm.get_completed_tasks()
    todo_items = sm.get_pending_tasks()
    
    print(f"\n>> SESSION ANALYSIS")
    print(f"   Manual Completed: {len(done_items)}")
    
    auto_achievements = auto_diff_scribe()
    if auto_achievements:
        done_items.extend(auto_achievements)
        
    print(f"   Total Aggregated: {len(done_items)}")
    print(f"   Pending Tasks:    {len(todo_items)}")
    
    # Safety Check: Empty Session?
    if not done_items and not args.auto_yes:
        print("   ⚠️  No tasks logged manually, and no diff changes found.")
        choice = input("   Proceed anyway? (y/N): ").strip().lower()
        if choice != 'y':
            print("🛑 Aborted. Please update task.md with [x] for completed items.")
            sys.exit(1)
    
    # 4. Prompt for Summary (if not provided)
    user_summary = args.summary
    if not user_summary and not args.auto_yes:
        print("\n>> SESSION SUMMARY")
        user_summary = input("   Enter session focus/summary (optional): ").strip()
    
    if not user_summary:
        user_summary = "General Session"

    # 5. Stop TimeKeeper & Capture Duration
    print("\n>> TIMEKEEPER STOP")
    print("-" * 30)
    duration = "N/A"
    if os.path.exists(TIME_KEEPER_SCRIPT):
        try:
             result = subprocess.run(f'"{sys.executable}" "{TIME_KEEPER_SCRIPT}" STOP', shell=True, check=True, capture_output=True, text=True)
             print(result.stdout)
             import re
             match = re.search(r"SESSION_DURATION:\s*((?:\d+d\s+)?\d+:\d+:\d+)", result.stdout)
             if match:
                 duration = match.group(1)
        except Exception as e:
             print(f"⚠️  TimeKeeper failed: {e}")

    # 6. Intelligent Update (Deduplicated)
    sm.update_session_log(done_items, todo_items, duration=duration, status=user_summary)
    sm.mark_completed_in_backlog(done_items)
    sm.update_backlog(todo_items)
    sm.archive_completed_tasks() 
    
    # 7. Cleanup
    wipe_workbench(sm.task_path)

    # 8. Safety Check
    manage_git_status(auto_commit=args.commit, commit_msg=args.message, auto_yes=args.auto_yes, auto_achievements=auto_achievements)

    # 9. Page the user — automated, no agent memory required
    pager_script = os.path.expanduser("~/.gemini/antigravity/skills/telegram_pager/scripts/send_notification.py")
    if os.path.exists(pager_script):
        try:
            # Build compact summary from whatever we have
            achievement_preview = ""
            if done_items:
                first = done_items[0].replace(" (Auto-Analyzed by diff)", "")
                achievement_preview = f" — {first[:100]}"
            page_msg = f"🌙 Session closed. Duration: {duration}. {len(done_items)} achievements{achievement_preview}"
            subprocess.run(
                f'"{sys.executable}" "{pager_script}" "Administrator" "{page_msg}"',
                shell=True, cwd=WORKSPACE_DIR, timeout=15
            )
        except Exception as e:
            print(f"⚠️  Telegram pager failed: {e}")

    print("\n✅ Session Closed. Good night.")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
