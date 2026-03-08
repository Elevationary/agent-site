# Lifecycle Management: The Graduation Ceremony 🎓

This directive defines the protocol for "Promoting" a Sales Opportunity (Project) into a fully commissioned Client Repository.

## The Concept
- **The Incubator:** Projects start as "Topics" inside a Prime Contractor or Sales Folder (e.g., `Elevationary > Build > Jericho`).
- **The Graduation:** When a deal is won, the folder "moves out" to become its own root (e.g., `Antigravity/Jericho`).
- **Identity Preservation:** By **MOVING** (not copying) the folder, the **Google Drive Folder ID** remains constant, preserving all history and links.

---

## 📅 The Graduation Protocol

### Automated Promotion (Preferred)

Use the `promote_project.py` orchestration script to handle the entire migration atomically.

```bash
python3 execution/promote_project.py "[Client Name]" "[Path/To/Source/Folder]" "[Path/To/Prime/Roster.json]"
```

**What this does:**
1.  **Commissioning:** Creates `.../Antigravity/[Client Name]` and installs the Universal Template.
2.  **Migration:** Resolves the Folder ID and moves it to the Antigravity Root.
3.  **Handoff:** Removes the entry from Prime Roster and initializes the Client Roster with the correct Drive ID.

### Manual Protocol (Fallback)

If the script fails, follow these steps manually:

#### 1. Commission the Ship (Create Workspace)
Create the new Agent Repository structure in your local filesystem (or cloned from Hub).
*   **Path:** `.../Antigravity/[Client Name]`
*   **Action:** Copy the Universal Template structure (`docs/`, `scripts/`, `startup.py`).

#### 2. The Great Migration (Drive Move)
**CRITICAL:** Do not create a new folder. Move the existing one.
1.  Locate the Project Folder inside the Prime/Sales folder.
2.  **Move** this entire folder to the `Antigravity` root.
3.  **Result:** The Folder ID (e.g., `1R1Y...`) stays exactly the same.

#### 3. Roster Handoff (The Switch)
**A. Update the Prime (Parent) Roster**
-   Open `[Prime]/docs/CLIENT_ROSTER.json`.
-   Remove the entry from the `projects` list or contacts.

**B. Initialize the Client (Child) Roster**
-   Create/Update `[Client]/docs/CLIENT_ROSTER.json`.
-   Set `gdrive_folder_id` to the **original** Folder ID.

#### 4. Activation (Startup)
1.  Navigate to the new workspace: `cd .../Antigravity/[Client Name]`.
2.  Run `python3 startup.py`.
3.  **Verify:** The Morning Briefing should show the correct Financials and Status.

---

## 🔄 Reversal (Decommissioning)
If a Client churns or becomes inactive:
1.  **Archive:** Move the folder back to an `_Archive` or `_Past_Clients` directory designated by the Administrator.
2.  **State:** Update `project_state.md` to `🔴 Decommissioned`.
3.  **Roster:** You may keep the roster for historical lookup or move it to `_Archive`.

> **Last Modified:** 2026-02-26
