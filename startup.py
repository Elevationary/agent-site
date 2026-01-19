import os
import sys
import datetime
import subprocess

def print_banner():
    print("\n=================================================================")
    print("   ⚓️  FLEET COMMANDER :: MORNING MUSTER")
    print("=================================================================")

def check_directives():
    """Checks the status of critical directives."""
    directives = [
        "directives/Gemini.md",
        "docs/project_state.md", 
        "docs/task.md"
    ]
    print("\n📜 DIRECTIVES STATUS:")
    
    current_time = datetime.datetime.now()
    
    for d in directives:
        if os.path.exists(d):
            mod_time = datetime.datetime.fromtimestamp(os.path.getmtime(d))
            # Calculate age
            age = current_time - mod_time
            age_str = ""
            if age.days == 0:
                age_str = "(Today)"
            elif age.days == 1:
                age_str = "(Yesterday)"
            else:
                age_str = f"({age.days} days ago)"
                
            print(f"   - {d:<30} : Updated {mod_time.strftime('%Y-%m-%d %H:%M')} {age_str}")
        else:
            print(f"   - {d:<30} : ❌ MISSING")

def check_motd():
    """Prints the Message of the Day if present."""
    motd_path = "docs/MOTD.md"
    if os.path.exists(motd_path):
        print("\n📣 ORDERS OF THE DAY (docs/MOTD.md):")
        print("-" * 65)
        with open(motd_path, "r") as f:
            content = f.read().strip()
            if content:
                print(content)
            else:
                print("   (No orders logged)")
        print("-" * 65)
    else:
        print("\n📣 NO SPECIFIC ORDERS TODAY.")

def start_timekeeper():
    """Invokes the Global Timekeeper."""
    print("\n⏱️  STARTING CLOCK...")
    # Call the global time_keeper
    time_keeper_path = os.path.expanduser("~/.gemini/antigravity/skills/time_keeper/scripts/time_keeper.py")
    if os.path.exists(time_keeper_path):
        try:
            subprocess.run([sys.executable, time_keeper_path, "START"], check=True)
        except subprocess.CalledProcessError as e:
            print(f"   ❌ Timekeeper failed: {e}")
    else:
        print(f"   ❌ Global Timekeeper not found at {time_keeper_path}")

if __name__ == "__main__":
    print_banner()
    check_directives()
    check_motd()
    start_timekeeper()
    print("\n✅ SESSION INITIALIZED. AWAITING COMMANDS.\n")
