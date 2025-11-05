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

5. **Issue and PR Creation**:
   - If critical issues are found, create a GitHub issue documenting all high-severity problems
   - Include issue number in PR description
   - ALWAYS create the PR regardless of issues found
   - Link the GitHub issue in the PR description if critical issues exist

6. **Review Output**:
   - Provide detailed code review feedback
   - List strengths, issues (by severity), and suggestions
   - Include checklist for type safety, error handling, tests, docs, security, performance
   - Return both issue link (if created) and PR link when complete

**IMPORTANT**:
- If high-severity issues are found, create a GitHub issue first, then proceed with PR creation
- Always create the PR - do not block PR creation
- Link any critical issues in the PR description for visibility
- Provide constructive, educational feedback
- Ensure all changes align with Furever Home monorepo architecture
