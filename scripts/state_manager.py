import os
import re
import datetime
import sys

sys.path.append(os.path.expanduser("~/.gemini/antigravity/runtime"))
from global_paths import resolve_path

class StateManager:
    """
    Intelligent manager for Agent State Files (project_state.md, SESSION_LOG.md, BACKLOG.md).
    Prevents duplication, enforces structure, and maintains context.
    """
    
    def __init__(self, workspace_dir, task_path=None):
        self.workspace_dir = workspace_dir
        self.docs_dir = resolve_path("{ANTIGRAVITY_DATA_DIR}/micro-site/agent-site/docs")
        
        # Determine Task Path
        if task_path and os.path.exists(task_path):
            self.task_path = task_path
            print(f"🎯 Using explicit task path: {task_path}")
        else:
            # Fallback: Prefer Root for Brain, check Docs for Workspace
            root_task = resolve_path("{ANTIGRAVITY_CODE_DIR}/micro-site/agent-site/task.md")
            docs_task = os.path.join(self.docs_dir, "task.md")
            
            if os.path.exists(root_task):
                self.task_path = root_task
            else:
                self.task_path = docs_task
            
        self.backlog_path = os.path.join(self.docs_dir, "BACKLOG.md")
        self.session_log_path = os.path.join(self.docs_dir, "SESSION_LOG.md")
        self.project_state_path = os.path.join(self.docs_dir, "project_state.md")

    def _read_file(self, path):
        if not os.path.exists(path):
            # print(f"⚠️  File not found: {path} (Checked CWD: {os.getcwd()})")
            return []
        with open(path, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f.readlines()]
            # print(f"DEBUG: Read {len(lines)} lines from {path}")
            return lines

    def _write_file(self, path, lines):
        if not os.path.exists(os.path.dirname(path)):
            os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")

    def sanitize_task(self, task_line):
        """Removes IDs and status markers to create a clean comparison string."""
        # Remove Checkboxes and Bullets (handles "- [ ]" and just "- ")
        clean = re.sub(r'^- (\[.*?\] )?', '', task_line)
        # Remove ID tags
        clean = re.sub(r'<!--.*?-->', '', clean)
        # Remove Markdown bold/italic
        clean = clean.replace("**", "").replace("*", "").replace("`", "")
        return clean.strip()

    def get_completed_tasks(self):
        """Extracts completed items from task.md."""
        raw_lines = self._read_file(self.task_path)
        completed = []
        for line in raw_lines:
            stripped = line.strip()
            if stripped.startswith("- [x]"):
                # Filter out System Directives (Protocol Zero, etc)
                if "PROTOCOL ZERO" in stripped:
                    continue
                completed.append(stripped.replace("- [x]", "", 1).strip())
        return completed

    def get_pending_tasks(self):
        """Extracts pending items from task.md."""
        raw_lines = self._read_file(self.task_path)
        pending = []
        for line in raw_lines:
            stripped = line.strip()
            if stripped.startswith("- [ ]") or stripped.startswith("- [/]"):
                # Filter out System Directives (Session Start, etc)
                if "Session Start" in stripped or "PROTOCOL ZERO" in stripped:
                    continue
                clean = stripped.replace("- [ ]", "", 1).replace("- [/]", "", 1).strip()
                pending.append(clean)
        return pending

    def get_next_tasks(self, limit=3):
        """
        Intelligently pulls actionable items from BACKLOG.md.
        Filters: Protocol Zero, Future Dates, Wrong Recurring Days.
        """
        if not os.path.exists(self.backlog_path):
            return []
            
        raw_lines = self._read_file(self.backlog_path)
        valid_items = []
        
        today = datetime.datetime.now()
        today_str = today.strftime("%Y-%m-%d")
        day_name = today.strftime("%A") # e.g. "Friday"
        
        for line in raw_lines:
            stripped = line.strip()
            if not stripped.startswith("- [ ]") or "PROTOCOL ZERO" in stripped:
                continue
                
            # Date Check: (Date: 2026-02-11)
            date_match = re.search(r"\(Date: (\d{4}-\d{2}-\d{2})\)", stripped)
            if date_match:
                if date_match.group(1) != today_str:
                    continue 

            # Recurring Check: (Recurring: ...)
            recur_match = re.search(r"\(Recurring:(.*?)\)", stripped, flags=re.IGNORECASE)
            if recur_match:
                recur_text = recur_match.group(1).lower()
                
                # Check if ANY specific day of the week is mentioned
                days_of_week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                mentioned_days = [d for d in days_of_week if d in recur_text]
                
                if mentioned_days:
                    today_name = day_name.lower()
                    if today_name not in mentioned_days:
                        continue # Skip: Today is not one of the specified days
                # If no specific days are mentioned, it defaults to daily, so it passes through

            valid_items.append(stripped)
            
        return valid_items[:limit]

    def update_project_state(self, new_items):
        """Smart Append: Only adds items NOT already in Recent Log."""
        if not new_items:
            return 
        
        current_lines = self._read_file(self.project_state_path)
        
        # Create a set of existing "clean" tasks for fast lookup
        existing_fingerprints = set()
        for line in current_lines:
            if line.strip().startswith("-"):
                 existing_fingerprints.add(self.sanitize_task(line))
        
        items_to_add = []
        for item in new_items:
            fingerprint = self.sanitize_task(item)
            if fingerprint and fingerprint not in existing_fingerprints:
                items_to_add.append(item)
        
        if not items_to_add:
            # print(f"✨ Project State is up to date (No new items). Found {len(existing_fingerprints)} existing.")
            return

        print(f"📝 Appending {len(items_to_add)} new items to Project State...")
        
        # Smart Insertion Logic
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        new_lines = [f"- [{today}]: {item} <!-- imported -->" for item in items_to_add]
        
        log_header = "## 📝 Recent Accomplishments (Log)"
        insertion_index = -1
        
        for i, line in enumerate(current_lines):
            if log_header in line:
                insertion_index = i
                break
        
        if insertion_index != -1:
            # Insert immediately after header
            # Check if next line is empty, if so, insert after it? No, keep it tight.
            current_lines[insertion_index+1:insertion_index+1] = new_lines
        else:
            # Fallback: Append to end
            current_lines.extend(new_lines)
            
        self._write_file(self.project_state_path, current_lines)

    def update_session_log(self, completed_tasks, pending_tasks, duration="0:00", status="Session Closed"):
        """
        Updates the Session Log. 
        If an entry for TODAY exists, it merges the new achievements (deduplicating) 
        and updates the stats. Otherwise, it appends a new entry.
        """
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        header = f"## Session: {today}"
        
        current_lines = self._read_file(self.session_log_path)
        
        # 1. Prepare New Data
        new_achievements = set()
        if completed_tasks:
            for t in completed_tasks:
                new_achievements.add(t) # Raw string, assuming consistent formatting
        
        # 2. Check for Existing Entry
        start_idx = -1
        end_idx = -1
        
        for i, line in enumerate(current_lines):
            if line.strip() == header:
                start_idx = i
                break
        
        existing_achievements = []
        
        if start_idx != -1:
            # Entry exists! Let's parse it to find where it ends and extract existing data
            # It ends at the next "## Session:" or EOF
            for i in range(start_idx + 1, len(current_lines)):
                if current_lines[i].strip().startswith("## Session:"):
                    end_idx = i
                    break
            if end_idx == -1:
                end_idx = len(current_lines)
                
            # Extract existing achievements from this block
            # Look for lines starting with "- " inside the Achievements section
            in_achievements = False
            for i in range(start_idx, end_idx):
                line = current_lines[i].strip()
                if "### 🏆 Achievements" in line:
                    in_achievements = True
                    continue
                if in_achievements and (line.startswith("###") or line.startswith("##")):
                    in_achievements = False
                
                if in_achievements and line.startswith("- "):
                    task_text = line[2:].strip()
                    if task_text != "No tasks completed.":
                        existing_achievements.append(task_text)

        # 3. Merge Achievements
        merged_achievements = existing_achievements[:]
        for item in new_achievements:
            if item not in existing_achievements:
                merged_achievements.append(item)
        
        # 4. Calculate Focus (Top 3 of MERGED)
        focus = "General Maintenance"
        if merged_achievements:
            focus_items = []
            for t in merged_achievements[:3]:
                clean = self.sanitize_task(t)
                if ":" in clean:
                    focus_items.append(clean.split(":", 1)[1].strip())
                else:
                    focus_items.append(clean)
            focus = ", ".join(focus_items)
            
        # 5. Build The Block (New or Replacement)
        block = [
            f"",
            header,
            f"**Focus:** {focus}",
            f"",
            f"### 🏆 Achievements"
        ]
        
        if merged_achievements:
            block.extend([f"- {task}" for task in merged_achievements])
        else:
            block.append("- No tasks completed.")
            
        block.append("")
        block.append("### 🫷 Pending Items")
        if pending_tasks:
            block.extend([f"- {task}" for task in pending_tasks])
        else:
            block.append("- No pending items.")
            
        block.append("")
        block.append("⏱️ Session Stats")
        # Note: We are overwriting duration with the LATEST session's duration.
        # Ideally we'd sum them, but we don't have previous duration easily parsed here yet without more complex regex.
        # Accepting LATEST duration as usage pattern typically involves one main session or sequential ones.
        block.append(f"* **Session Duration:** {duration}")
        block.append(f"* **Status:** {status}")
        block.append("") 
        
        # 6. Write Changes
        if start_idx != -1:
            print(f"🔄 Merging into existing Log Entry for {today}...")
            # Replace the old block with the new block
            current_lines[start_idx:end_idx] = block
            self._write_file(self.session_log_path, current_lines)
        else:
            print(f"📝 Creating new Log Entry for {today}...")
            # Append new block
            # Ensure there's spacing
            if current_lines and current_lines[-1].strip():
                 current_lines.append("")
            current_lines.extend(block)
            self._write_file(self.session_log_path, current_lines)
        
        print("✅ Session Log Updated.")

    def update_backlog(self, pending_items):
        """Smart Merge: Adds new pending items to Backlog."""
        if not pending_items:
            return

        current_lines = self._read_file(self.backlog_path)
        existing_fingerprints = set()
        for line in current_lines:
             if line.strip().startswith("-"):
                 existing_fingerprints.add(self.sanitize_task(line))
        
        items_to_add = []
        for item in pending_items:
            # Check if item is already in backlog (pending OR completed)
            fingerprint = self.sanitize_task(item)
            if fingerprint and fingerprint not in existing_fingerprints:
                items_to_add.append(item)
        
        if not items_to_add:
            print("✨ Backlog is up to date.")
            return

        print(f"📥 Moving {len(items_to_add)} items to Backlog...")
        
        # Append to end of file (or specific section if we get fancy later)
        with open(self.backlog_path, "a", encoding="utf-8") as f:
            for item in items_to_add:
                f.write(f"- [ ] {item}\n")

    def archive_completed_tasks(self):
        """
        Scans BACKLOG.md for completed items (- [x]) in pending sections 
        and moves them to '## Completed' at the bottom.
        """
        if not os.path.exists(self.backlog_path):
            return

        lines = self._read_file(self.backlog_path)
        pending_lines = []
        completed_lines = []
        
        # Simple State Machine
        in_completed_section = False
        in_recurring_section = False
        
        for line in lines:
            stripped = line.strip()
            
            # Detect Section Headers
            if stripped.lower().startswith("## completed"):
                in_completed_section = True
                in_recurring_section = False
                continue # Skip the header for now, we'll rebuild it
            elif stripped.lower().startswith("## recurring"):
                in_recurring_section = True
                in_completed_section = False
                pending_lines.append(line) # Keep the header in pending stack
                continue
            elif stripped.startswith("##"):
                in_completed_section = False
                in_recurring_section = False
            
            # Process Items
            is_task = stripped.startswith("- [x]") or stripped.startswith("- [ ]")
            
            if in_recurring_section and is_task:
                 # Recurring items stay where they are, even if checked (for now, or logic can be refined)
                 pending_lines.append(line)
            elif stripped.startswith("- [x]"):
                completed_lines.append(line) # Move to completed
            elif in_completed_section and stripped.startswith("-") and not stripped.startswith("- [ ]"):
                 # Assume items in "Completed" section are completed even if not marked [x]? 
                 # No, trust the [x]. But if we are in completed section, keep them there.
                 completed_lines.append(line)
            else:
                # Keep in place (Pending items, headers, blank lines)
                pending_lines.append(line)

        if not completed_lines:
            return # No changes needed if no completed items found (or all already in place? logic flaw?)
            # Actually, this logic rebuilds the file. If we ran it and found nothing NEW to move, 
            # we might still re-order. Ideally we only rewrite if changes.
            
        # Reconstruct File
        new_content = []
        
        # 1. Pending Sections (cleaned of completed items)
        # Remove trailing newlines to avoid gaps
        while pending_lines and not pending_lines[-1].strip():
             pending_lines.pop()
             
        new_content.extend(pending_lines)
        new_content.append("\n\n## Completed")
        new_content.extend(completed_lines)
        new_content.append("") # Final newline
        
        with open(self.backlog_path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_content))
            
        print(f"📦 Archived {len(completed_lines)} items to 'Ordered Completed'.")

    def sync_next_steps(self):
        """
        Syncs top pending items from BACKLOG.md to '## Next Steps' in project_state.md.
        Makes Backlog the Single Source of Truth.
        """
        if not os.path.exists(self.project_state_path) or not os.path.exists(self.backlog_path):
            return

        # 1. Get Top Items from Backlog
        next_tasks = self.get_next_tasks(limit=5) # Get top 5 actionable
        
        # 2. Read Project State
        lines = self._read_file(self.project_state_path)
        
        start_idx = -1
        end_idx = -1
        
        # 3. Find Section
        for i, line in enumerate(lines):
            if "## Next Steps" in line:
                start_idx = i
                continue
            if start_idx != -1 and line.startswith("##"):
                end_idx = i
                break
        
        if start_idx == -1:
            print("⚠️ '## Next Steps' section not found in project_state.md")
            return
            
        if end_idx == -1:
            end_idx = len(lines)
            
        # 4. Construct New Section
        new_section = [lines[start_idx]] # Keep Header
        
        if next_tasks:
            for task in next_tasks:
                # Remove checkbox if present in backlog string (get_next_tasks usually keeps it?)
                # get_next_tasks returns raw lines like "- [ ] Task" or "- Task"
                # We want to ensure it looks good.
                clean_task = task
                if not "- [ ]" in task and not "- [x]" in task:
                     clean_task = f"- [ ] {task.lstrip('- ').strip()}"
                
                # If it already has - [ ], just ensure indentation?
                # Let's just use the raw string from backlog which is usually correct
                new_section.append(clean_task)
        else:
            new_section.append("- No immediate next steps (Check Backlog).")
            
        # Add a blank line buffer
        new_section.append("")
        
        # 5. Replace
        print(f"🔄 Syncing {len(next_tasks)} Next Steps from Backlog to Project State...")
        lines[start_idx:end_idx] = new_section
        
        self._write_file(self.project_state_path, lines)

# Usage Example
if __name__ == "__main__":
    sm = StateManager(os.getcwd())
    done = sm.get_completed_tasks()
    todo = sm.get_pending_tasks()
    
    print(f"Found {len(done)} completed and {len(todo)} pending.")
