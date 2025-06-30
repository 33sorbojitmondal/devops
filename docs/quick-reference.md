# Quick Reference Guide

Quick reference for Git, GitHub, and GitHub Actions workflows in this DevOps project.

## 🚀 Quick Setup Commands

```bash
# Clone and setup project
git clone https://github.com/YOUR_USERNAME/devops-todo-app.git
cd devops-todo-app

# Install all dependencies and setup environment
npm run setup

# Verify setup
npm run verify

# Start development servers
npm run dev
```

## 📋 Git Commands Cheat Sheet

### Daily Workflow
```bash
# Check status
git status

# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Stage and commit changes
git add .
git commit -m "feat: your commit message"

# Push feature branch
git push -u origin feature/your-feature-name

# Create pull request (GitHub CLI)
gh pr create --title "Your PR Title" --body "Description"

# After PR merge, cleanup
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

### Branch Management
```bash
# List all branches
git branch -a

# Switch branches
git checkout branch-name

# Create new branch
git checkout -b new-branch-name

# Delete branch (local)
git branch -d branch-name

# Delete branch (remote)
git push origin --delete branch-name

# Rename current branch
git branch -m new-name
```

### Sync and Updates
```bash
# Update current branch with latest changes
git pull

# Rebase current branch on main
git rebase main

# Merge develop into current branch
git merge develop

# Force push (after rebase)
git push --force-with-lease
```

## 🔧 GitHub CLI Commands

### Repository Management
```bash
# Create repository
gh repo create devops-todo-app --public

# Clone repository
gh repo clone USERNAME/devops-todo-app

# View repository info
gh repo view

# Edit repository settings
gh repo edit --enable-issues --enable-wiki
```

### Pull Requests
```bash
# Create PR
gh pr create --title "Title" --body "Description"

# List PRs
gh pr list

# View PR details
gh pr view PR_NUMBER

# Check out PR locally
gh pr checkout PR_NUMBER

# Merge PR
gh pr merge PR_NUMBER --squash

# Close PR
gh pr close PR_NUMBER
```

### Issues
```bash
# Create issue
gh issue create --title "Bug report" --body "Description"

# List issues
gh issue list

# View issue
gh issue view ISSUE_NUMBER

# Close issue
gh issue close ISSUE_NUMBER
```

## ⚙️ GitHub Actions Reference

### Workflow Triggers
```yaml
# Push to specific branches
on:
  push:
    branches: [ main, develop ]

# Pull requests
on:
  pull_request:
    branches: [ main ]

# Manual trigger
on:
  workflow_dispatch:

# Scheduled (every Monday at 2 AM)
on:
  schedule:
    - cron: '0 2 * * 1'

# Multiple triggers
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'
```

### Common Actions
```yaml
# Checkout code
- uses: actions/checkout@v4

# Setup Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'

# Install dependencies
- run: npm ci

# Run tests
- run: npm test

# Upload artifacts
- uses: actions/upload-artifact@v3
  with:
    name: build-files
    path: dist/
```

### Environment Variables and Secrets
```yaml
# Use repository secret
env:
  API_KEY: ${{ secrets.API_KEY }}

# Use environment variable
env:
  NODE_ENV: production

# Use output from previous step
- id: build
  run: echo "version=1.0.0" >> $GITHUB_OUTPUT
- run: echo "Version is ${{ steps.build.outputs.version }}"
```

## 📦 NPM Scripts Reference

### Root Project Scripts
```bash
# Setup entire project
npm run setup

# Start all development servers
npm run dev

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build

# Verify project setup
npm run verify

# Setup GitHub repository
npm run github:setup
```

### Backend Scripts
```bash
cd backend

# Development
npm run dev          # Start with nodemon
npm start           # Start production server

# Testing
npm test            # Run tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report

# Code Quality
npm run lint        # Check code style
npm run lint:fix    # Fix issues
npm run format      # Format code

# Database
npm run db:migrate  # Run migrations
npm run db:seed     # Seed database
```

### Frontend Scripts
```bash
cd frontend

# Development
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build

# Testing
npm test           # Run tests
npm run test:ui    # Interactive testing

# Code Quality
npm run lint       # Check code style
npm run lint:fix   # Fix issues
npm run format     # Format code
```

## 🔍 Troubleshooting Commands

### Git Issues
```bash
# Reset local changes
git reset --hard HEAD

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (remove changes)
git reset --hard HEAD~1

# Resolve merge conflicts
git status          # See conflicted files
# Edit files to resolve conflicts
git add .
git commit

# Abort merge
git merge --abort

# Clean untracked files
git clean -fd
```

### GitHub Actions Debugging
```bash
# View workflow runs
gh run list

# View specific run
gh run view RUN_ID

# Re-run failed workflows
gh run rerun RUN_ID

# Download logs
gh run download RUN_ID
```

### Development Issues
```bash
# Clear all node_modules
npm run clean

# Reinstall everything
npm run reset

# Check for outdated packages
npm outdated

# Update packages
npm update

# Fix npm cache issues
npm cache clean --force
```

## 🎯 DevOps Best Practices

### Commit Messages (Conventional Commits)
```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
ci: CI/CD changes
perf: performance improvements
build: build system changes
```

### Branch Naming
```bash
feature/add-user-auth      # New features
fix/login-bug             # Bug fixes
hotfix/security-patch     # Critical fixes
docs/update-readme        # Documentation
refactor/cleanup-api      # Code refactoring
test/add-unit-tests       # Testing
ci/update-workflow        # CI/CD changes
```

### PR Best Practices
- Small, focused changes
- Clear title and description
- Link to related issues
- Include screenshots for UI changes
- Ensure CI passes
- Request appropriate reviewers
- Address review comments promptly

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Backward compatibility maintained

## 🔗 Useful Links

- [Git Documentation](https://git-scm.com/docs)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

## 🆘 Getting Help

```bash
# Git help
git help <command>

# GitHub CLI help
gh help
gh <command> --help

# Project-specific help
npm run verify      # Check setup
cat docs/README.md  # Read documentation
```

**Remember**: This is a learning project! Don't be afraid to experiment and make mistakes. 🚀 