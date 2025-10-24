---
description: Review code changes and create a pull request
---

Use the **code-reviewer-pr** agent to conduct a comprehensive code review and create a pull request for the current changes.

## Task for Agent:

Review all staged and unstaged changes in the current branch, then create a pull request following these steps:

1. **Comprehensive Code Review**:
   - Analyze all code changes for adherence to project standards (CLAUDE.md)
   - Check TypeScript type safety and best practices
   - Validate monorepo architecture patterns
   - Review framework-specific patterns (NestJS, Next.js, Drizzle ORM)
   - Identify security vulnerabilities and bugs
   - Assess performance implications
   - Verify test coverage

2. **Architecture-Specific Validation**:
   - **Backend (NestJS)**: Module structure, DI, error handling, @ts-rest API contracts
   - **Frontend (Next.js)**: App Router patterns, client/server components, Zod validation
   - **Database**: Drizzle schema patterns, migrations, foreign keys
   - **API Contracts**: Type-safe contracts, Zod schemas
   - **Shared Packages**: Component reusability, proper exports

3. **Cross-Package Impact Analysis**:
   - If API contracts changed: Verify frontend and backend are in sync
   - If database schemas changed: Check for migrations and Zod schema updates
   - If shared components changed: Verify backward compatibility

4. **Git Workflow Automation**:
   - Create descriptive branch name (feature/* or fix/*)
   - Stage all relevant changes
   - Commit with conventional commit message
   - Push to remote repository
   - Create pull request with comprehensive description

5. **Review Output**:
   - Provide detailed code review feedback
   - List strengths, issues (by severity), and suggestions
   - Include checklist for type safety, error handling, tests, docs, security, performance
   - Only create PR if no high-severity issues found
   - Return PR link when complete

**IMPORTANT**:
- Block PR creation if high-severity security vulnerabilities, breaking changes without migration path, or broken core functionality are present
- Provide constructive, educational feedback
- Ensure all changes align with Furever Home monorepo architecture
