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
        # Use sys.executable to ensure we use the same python interpreter if needed
        subprocess.check_call([sys.executable, global_shutdown_script] + sys.argv[1:])
    except subprocess.CalledProcessError as e:
        sys.exit(e.returncode)
    except KeyboardInterrupt:
        print("\nShutdown interrupted.")
        sys.exit(1)

if __name__ == "__main__":
    main()
