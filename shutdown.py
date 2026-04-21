import os
import sys
import subprocess

"""
Shim script to invoke the global Morning Muster shutdown protocol.
This allows running `python3 shutdown.py` directly from the repo root.
"""

def main():
    # Path to the global morning_muster skill shutdown script
    global_shutdown_script = os.path.expanduser("~/.gemini/antigravity/skills/morning_muster/scripts/shutdown.py")
    
    if not os.path.exists(global_shutdown_script):
        print(f"Error: Global shutdown script not found at {global_shutdown_script}")
        print("Please ensure the 'morning_muster' skill is installed correctly.")
        sys.exit(1)

    # Execute the global script passing along any arguments
    print(f"🛑 Invoking Global Morning Muster Shutdown: {global_shutdown_script}")
    try:
        args = sys.argv[1:]
        
        # If the AI Agent is running this, force non-interactive mode to prevent hangs
        if os.environ.get("ANTIGRAVITY_AGENT") == "1":
            if "--auto-yes" not in args and "-y" not in args:
                args.append("-y")
            if "--commit" not in args and "-c" not in args:
                args.append("--commit")
            # We don't force a message, the script might auto-generate one or use a default session log
            print("🤖 Agent detected: Auto-setting '-y' and '--commit' to prevent interactive hang.")

        subprocess.check_call([sys.executable, global_shutdown_script] + args)
    except subprocess.CalledProcessError as e:
        sys.exit(e.returncode)
    except KeyboardInterrupt:
        print("\nShutdown interrupted.")
        sys.exit(1)

if __name__ == "__main__":
    main()
