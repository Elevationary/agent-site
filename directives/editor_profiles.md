# Antigravity Editor Profiles
*Configuration guide for optimizing the VS Code experience during Agentic workflows.*

## The Strategy
We separate **WHAT** we work on (Archetypes/Folders) from **HOW** we view it (Profiles):
*   **Archetypes:** File structure (Consulting, SaaS, Content). Live in `directives/`.
*   **Profiles:** Editor settings (Maker, Manager). Live in VS Code `.json` settings.

## Profile 1: "The Maker" (Flow State)
*Use this when YOU are writing code or content. Focus is on clarity.*

### Recommended Settings (`settings.json`)
```json
{
    "files.exclude": {
        "**/.antigravity": true,         // Hide agent brains
        "**/tmp_agent_builds": true,     // Hide temp clutter
        "**/.git": true                  // Hide git internals
    },
    "explorer.fileNesting.enabled": true,
    "explorer.fileNesting.patterns": {
        "*.ts": "${capture}.test.ts, ${capture}.spec.ts",
        "package.json": "package-lock.json, .antigravity-plan.md"
    },
    "files.autoSave": "onFocusChange"
}
```

## Profile 2: "Mission Control" (Manager Mode)
*Use this when monitoring AGENTS. Focus is on visibility and artifacts.*

### Recommended Settings (`settings.json`)
```json
{
    "files.exclude": {
        // Show EVERYTHING. Agents sometimes hide in the shadows.
        "**/.git": true 
    },
    "explorer.fileNesting.enabled": false, // Expand all to see what they generated
    "files.autoSave": "afterDelay",        // Save instantly so Agents see it
    "files.autoSaveDelay": 1000
}
```

## Setup Instructions
1.  **Gear Icon > Profiles > Create Profile**.
2.  Name it **"Antigravity Manager"**.
3.  Open **Command Palette** (`Cmd+Shift+P`) > `Preferences: Open Settings (JSON)`.
4.  Paste the "Mission Control" block above.
