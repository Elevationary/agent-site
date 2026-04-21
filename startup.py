
import os
import sys
import subprocess

"""
Shim script to invoke the global Morning Muster startup protocol.
Also checks for session_handover.md and displays it before briefing.
"""


def check_session_handover():
    """If docs/session_handover.md exists, display it before startup."""
    handover_path = os.path.join(os.getcwd(), "docs", "session_handover.md")
    if os.path.exists(handover_path):
        print("=" * 60)
        print("🔄 SESSION HANDOVER — Read this before proceeding")
        print("=" * 60)
        with open(handover_path, "r", encoding="utf-8") as f:
            print(f.read())
        print("=" * 60)
        print("   ⬆️  Handover active. Pick up exactly where the above leaves off.")
        print("   📝  After consuming, write updated session_handover.md at shutdown.")
        print("=" * 60)
        print()
    return os.path.exists(handover_path)


def main():
    # Check for session handover before anything else
    check_session_handover()

    # Path to the global morning_muster skill startup script
    global_startup_script = os.path.expanduser("~/.gemini/antigravity/skills/morning_muster/scripts/startup.py")

    if not os.path.exists(global_startup_script):
        print(f"Error: Global startup script not found at {global_startup_script}")
        print("Please ensure the 'morning_muster' skill is installed correctly.")
        sys.exit(1)

    # Execute the global script passing along any arguments
    print(f"🚀 Invoking Global Morning Muster: {global_startup_script}")
    try:
        args = sys.argv[1:]

        # If the AI Agent is running this, force non-interactive mode to prevent hangs
        if os.environ.get("ANTIGRAVITY_AGENT") == "1":
            if "--import-mode" not in args and "-i" not in args:
                args.extend(["-i", "all"])
                print("🤖 Agent detected: Auto-setting import-mode to 'all' to prevent interactive hang.")

        subprocess.check_call([sys.executable, global_startup_script] + args)
    except subprocess.CalledProcessError as e:
        sys.exit(e.returncode)
    except KeyboardInterrupt:
        print("\nStartup interrupted.")
        sys.exit(1)


if __name__ == "__main__":
    main()
