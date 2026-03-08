# Universal Coding Standards & Protocols

> [!IMPORTANT]
> **ALL AGENTS MUST READ AND ADHERE TO THESE STANDARDS.**
> Failure to comply results in Technical Debt and breaks Global Inventory references.

## 1. Documentation (The "Definition of Done")
**Rule #1: No script shall be committed without a semantic docstring.**

Every Python script (`.py`) MUST begin with a module-level docstring describing its purpose, inputs, and outputs.

**Correct:**
```python
"""
Generates a PDF invoice from Calendar data.
Args:
    client_name (str): Name of the client configuration to load.
    month (str): Target month (YYYY-MM).
Returns:
    str: Path to the generated PDF.
"""
import sys
...
```

**Incorrect:**
```python
import sys
# This script makes invoices
...
```

## 2. Usability
**Rule #2: Scripts must output `--help` instructions.**

Every script executable from the command line MUST support receiving no arguments or specific help flags to print usage instructions.

```python
if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] in ["--help", "-h"]:
        print("Usage: python3 generate_invoice.py <client_name> <month>")
        sys.exit(0)
```

## 3. Global Skills Integration
When creating a Global Skill in `~/.gemini/antigravity/skills/`:
1.  Ensure `SKILL.md` exists with frontmatter (`name`, `description`).
2.  Ensure all scripts in `scripts/` have docstrings (as per Rule #1).
3.  The "Global Capabilities" report parses these docstrings automatically. **If you don't write it, no one knows your tool exists.**

> **Last Modified:** 2026-02-26
