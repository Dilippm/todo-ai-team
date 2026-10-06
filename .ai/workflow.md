# AI Development Workflow

## Phase 1 — Planning

Manager receives a requirement.

Manager must:

1. Understand the requirement.
2. Break it into tasks.
3. Identify which agent owns each task.
4. Create a task list.

---

## Phase 2 — Development

Developer implements application tasks.

Developer must:

1. Inspect existing code.
2. Implement only the assigned task.
3. Run local tests.
4. Report completion.

---

## Phase 3 — QA

After Developer completion:

QA must:

1. Inspect the implementation.
2. Run automated tests.
3. Run additional tests when required.
4. Report PASS or FAIL.

### If FAIL

Manager sends the bug back to Developer.

### If PASS

Continue to DevOps.

---

## Phase 4 — DevOps

DevOps handles:

- Docker
- CI
- CD
- Deployment configuration

DevOps must verify that:

- Tests pass.
- Docker builds.
- CI configuration works.

---

## Phase 5 — Completion

Manager verifies that:

Developer → PASS
QA → PASS
DevOps → PASS
CI → PASS

Then report the project/task as COMPLETE.

---

## Production

Production deployment always requires explicit user approval.