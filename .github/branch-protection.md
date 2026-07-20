# Branch protection (recommended)

Configure required status checks in GitHub rulesets using this exact PR check:

- `CI / quality-gate`

Notes:

- This workflow runs for pull requests, `main`, and manual dispatch. Require this check for pull requests.
