# TASK-002 — Containerize Todo Application

## Assigned Agent
DevOps Agent

## Objective

Containerize the Todo application so that the entire
development environment can be started with Docker Compose.

## Requirements

1. Create a Dockerfile for the backend.
2. Create docker-compose.yml.
3. Add MongoDB as a Docker service.
4. Configure backend to connect to MongoDB using environment variables.
5. Do not hard-code credentials.
6. Add a health check.
7. Make the application accessible locally.
8. Verify that the backend starts successfully.
9. Verify that MongoDB is reachable.
10. Run the existing test suite.

## Authority

You MAY:
- Create Docker files.
- Modify Docker configuration.
- Modify CI/CD configuration.
- Run Docker commands.
- Run tests.

You MUST NOT:
- Modify application business logic.
- Delete databases.
- Deploy to production.
- Modify secrets.
- Change QA tests.

## Completion Criteria

Report:

BUILD:
PASS / FAIL

CONTAINERS:
PASS / FAIL

DATABASE CONNECTION:
PASS / FAIL

TESTS:
PASS / FAIL

HEALTH CHECK:
PASS / FAIL

CHANGES:
<list>

Do not deploy to production.