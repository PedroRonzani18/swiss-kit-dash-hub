# Branch protection (recommended)

Configure required status checks in GitHub rulesets using this exact PR check:

- `PR CI / quality-gate`

Notes:

- This check is produced only on `pull_request`, avoiding duplicate contexts from `push`.
- `Main CI / quality-gate-main` runs on `main` after merge and should not be required for PR merge.
