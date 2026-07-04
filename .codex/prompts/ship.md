# Swiss Kit Codex Pipeline

Execute a controlled Swiss Kit pipeline for this request.

## Feature request

{{FEATURE_REQUEST}}

## Run ID

{{RUN_ID}}

## Pipeline directory

Use:

`.pipeline/runs/{{RUN_ID}}/`

Create it if it does not exist.

Do not use files from another run.

---

## Required stages

Run the stages in this order:

1. Planner
2. Coder
3. Reviewer

Tester and Security Reviewer are not part of the MVP pipeline yet. For now:

- the Coder may add or update tests when the spec requires it;
- the Coder must run the most relevant validation commands when possible;
- the Reviewer must evaluate test adequacy and validation quality.

---

## Stage 1: Planner

Use the `planner` agent.

It must generate:

- `.pipeline/runs/{{RUN_ID}}/request.md`
- `.pipeline/runs/{{RUN_ID}}/context.md`
- `.pipeline/runs/{{RUN_ID}}/spec.md`

The Planner must inspect the actual repository and use real commands, real files and real patterns.

If `spec.md` contains `OPEN QUESTIONS`, stop and show the questions.

---

## Stage 2: Coder

Use the `coder` agent.

It must:

- read `spec.md`
- read `context.md`
- implement exactly the spec
- add or update tests if the spec requires behavior changes
- run relevant validation commands when possible
- generate `.pipeline/runs/{{RUN_ID}}/changes.md`

Hard rules:

- Do not commit.
- Do not merge.
- Do not push.
- Do not alter scope.
- Do not hide failures.

---

## Stage 3: Reviewer

Use the `reviewer` agent.

It must:

- read `spec.md`
- read `context.md`
- read `changes.md`
- inspect `git diff`
- inspect validation results
- generate `.pipeline/runs/{{RUN_ID}}/review.md`

If the verdict is `BLOCK`, stop and show the review.

---

## Final response

At the end, show:

- run directory
- summary of implementation
- files changed
- validation commands run
- Reviewer verdict
- risks or limitations
- recommended next action

---

## Swiss Kit hard rules

- Keep the repo generic and template-friendly.
- Do not reintroduce finance-domain implementation.
- Do not copy Oppem systems wholesale.
- Preserve monorepo conventions.
- Preserve frontend/backend/contracts separation.
- Treat auth, contracts, Prisma, CORS, JWT and cookies as sensitive.
