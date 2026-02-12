import os
import sys
import subprocess
import datetime

# CONFIGURATION
TIME_KEEPER_PATH = os.path.expanduser("~/.gemini/antigravity/skills/time_keeper/scripts/time_keeper.py")
SESSION_LOG_PATH = "docs/session_log.md"

def stop_clock():
    """Stops the global timekeeper and captures the output."""
    if not os.path.exists(TIME_KEEPER_PATH):
        print(f"❌ Error: Timekeeper not found at {TIME_KEEPER_PATH}")
        return None, None

    try:
        result = subprocess.run(
            [sys.executable, TIME_KEEPER_PATH, "STOP"],
            capture_output=True,
            text=True,
            check=True
        )
        output = result.stdout.strip()
        print(output) # Show user the raw output

        # Parse Output
        duration = "0:00:00"
        total = "0:00:00"
        
        for line in output.split('\n'):
            if "SESSION_DURATION:" in line:
                duration = line.split("SESSION_DURATION:")[1].strip()
            if "DAILY_TOTAL:" in line:
                total = line.split("DAILY_TOTAL:")[1].strip()
                
        return duration, total

    except subprocess.CalledProcessError as e:
        print(f"❌ Error running timekeeper: {e}")
        return None, None

def update_session_log(duration, total):
    """Appends session stats to the log file."""
    if not os.path.exists(SESSION_LOG_PATH):
        print(f"⚠️ Warning: {SESSION_LOG_PATH} not found. Skipping log update.")
        return

    # Check if stats already exist for this session (rudimentary check)
    # We'll just append. The user can edit if it's duplicate.
    
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    entry = f"\n### ⏱️ Session Stats ({timestamp})\n\n"
    entry += f"*   **Session Duration:** {duration}\n"
    entry += f"*   **Daily Total:** {total}\n"
    entry += f"*   **Status:** **Session Closed.** Standing Down.\n"
    
    try:
        with open(SESSION_LOG_PATH, "a") as f:
            f.write(entry)
        print(f"✅ Updated {SESSION_LOG_PATH} with session stats.")
    except Exception as e:
        print(f"❌ Failed to update session log: {e}")

def main():
    print("🛑 INITIATING STAND DOWN PROTOCOL...")
    
    # 1. Stop the Clock
    duration, total = stop_clock()
    
    if duration:
        # 2. Update the Log
        update_session_log(duration, total)
        
    print("\n👋 SESSION COMPLETE. GOODBYE.")

if __name__ == "__main__":
    main()
