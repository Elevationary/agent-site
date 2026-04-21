# ORS Log: [Feature/Fix Name]
**Date:** YYYY-MM-DD | **Agent:** [Agent Name] | **Session:** [Session ID]

## Stage 2a: MODEL (Expected Outcome)
> What should the output look like? Be specific and measurable.

- Expected: [describe]

## Stage 2b: OBSERVE (Actual Outcome)
> What did you actually see when you opened/inspected the output?

- Observed: [describe]

## Stage 2c: COMPARE
- [ ] Expected matches observed? (If NO → Self-Annealing, do not proceed)

## Stage 3: RED-TEAM Findings
| Question | Answer | Action Required? |
|---|---|---|
| Credential expiry? | | |
| Silent failure on dependency loss? | | |
| try/except printing generic messages? | | |
| Monitoring uses same code paths? | | |
| Agent-authored files protected? | | |
| Blast radius if fails at 3am? | | |

## Stage 4: REMEDIATION
> What did you fix based on Red-Team findings?

- [list actions taken]

## Stage 5: RETEST
- [ ] Verification script re-run after remediation?
- [ ] Clean pass? (If NO → loop to Stage 4)

## Result
- [ ] **ORS PASS** — all 5 stages complete, clean retest
- [ ] **ORS FAIL** — requires additional remediation
