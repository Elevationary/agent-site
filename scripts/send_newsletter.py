import os
import sqlite3
import requests
import json
import subprocess
from dotenv import load_dotenv

# Load .env
load_dotenv()

POSTMARK_TOKEN = os.getenv("POSTMARK_SERVER_TOKEN")
SENDER_EMAIL = "james@elevationary.com" # TODO: Configure this in .env or script constants

def fetch_active_subscribers():
    """
    Fetches active subscribers from Cloudflare D1 using Wrangler.
    Since we cannot directly connect to D1 from Python (yet), we use the CLI JSON output.
    """
    try:
        print("🔍 Fetching subscribers from D1...")
        # Execute query via Wrangler
        result = subprocess.run(
            [
                "npx", "wrangler", "d1", "execute", "subscribers", 
                "--command", "SELECT email FROM subscribers WHERE status = 'active' OR status = 'trial'",
                "--json"
            ],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Parse JSON output from Wrangler
        # Wrangler D1 output structure is often [ { "results": [], "success": true } ]
        data = json.loads(result.stdout)
        
        # Handle potential array wrapper
        if isinstance(data, list):
            data = data[0]
            
        rows = data.get("results", [])
        emails = [row["email"] for row in rows]
        print(f"✅ Found {len(emails)} active subscribers.")
        return emails

    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to query D1: {e.stderr}")
        return []
    except json.JSONDecodeError as e:
        print(f"❌ Failed to parse D1 output: {result.stdout}")
        return []

def send_broadcast(recipients, subject, html_body, text_body):
    """
    Sends a broadcast email via Postmark using the 'MessageStream' = 'broadcast'.
    """
    if not recipients:
        print("⚠️ No recipients found. Aborting.")
        return

    url = "https://api.postmarkapp.com/email/batch"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": POSTMARK_TOKEN
    }

    # Postmark Batch Limit is 500. We must paginate if list > 500.
    batch_size = 500
    
    for i in range(0, len(recipients), batch_size):
        batch = recipients[i:i + batch_size]
        payload = []
        
        for email in batch:
            payload.append({
                "From": SENDER_EMAIL,
                "To": email,
                "Subject": subject,
                "HtmlBody": html_body,
                "TextBody": text_body,
                "MessageStream": "broadcast" # Critical: Use Broadcast Stream
            })
            
        print(f"🚀 Sending batch {i // batch_size + 1} ({len(batch)} emails)...")
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            print(f"✅ Batch sent! Status: {response.status_code}")
        except requests.exceptions.HTTPError as e:
            print(f"❌ Batch failed: {e}")
            print(response.text)

if __name__ == "__main__":
    print("--- Elevationary Newsletter Broadcaster ---")
    
    # 1. Fetch Audience
    subscribers = fetch_active_subscribers()
    
    # 2. Define Content (Ideally loaded from a file/markdown)
    subject = "Elevationary Weekly: The Agentic Future"
    html_content = "<h1>Hello!</h1><p>Here is your weekly update.</p>"
    text_content = "Hello! Here is your weekly update."
    
    # 3. Confirm & Send
    if subscribers:
        confirm = input(f"Ready to send to {len(subscribers)} people? (yes/no): ")
        if confirm.lower() == "yes":
            send_broadcast(subscribers, subject, html_content, text_content)
        else:
            print("🚫 Aborted.")
