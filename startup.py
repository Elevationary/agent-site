import os
import sys

# STRICT REDIRECT TO GLOBAL SKILL
GLOBAL_SCRIPT = os.path.expanduser("~/.gemini/antigravity/skills/morning_muster/scripts/startup.py")

if __name__ == "__main__":
    if os.path.exists(GLOBAL_SCRIPT):
        # Replace current process with global script
        # We use os.execv to ensure the PID remains (cleaner) or subprocess for safety.
        # Using subprocess is safer for cross-platform compatibility in this environment.
        import subprocess
        try:
            subprocess.run([sys.executable, GLOBAL_SCRIPT] + sys.argv[1:], check=True)
        except KeyboardInterrupt:
            pass
        except Exception as e:
            print(f"❌ Global Startup Failed: {e}")
            sys.exit(1)
    else:
        print(f"❌ CRITICAL ERROR: Global Skill not found at {GLOBAL_SCRIPT}")
        print("   Please ensure 'morning_muster' skill is installed.")
        sys.exit(1)
