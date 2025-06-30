# GitHub Setup Guide

Complete guide for setting up the DevOps Todo App with Git, GitHub, and GitHub Actions.

## 🎯 Overview

This guide walks you through:
1. Creating a GitHub repository
2. Setting up local Git workflow
3. Configuring GitHub Actions
4. Implementing CI/CD pipelines
5. Using GitHub features for DevOps

## 📋 Prerequisites

- Git installed locally
- GitHub account (free)
- Node.js v16+ installed
- Code editor (VS Code recommended)

## 🚀 Step 1: Create GitHub Repository

### Option A: Create from GitHub Web Interface

1. **Go to GitHub.com** and sign in
2. **Click "New repository"** (green button)
3. **Configure repository**:
   ```
   Repository name: devops-todo-app
   Description: DevOps learning project with Todo app
   Visibility: Public (for free GitHub Actions)
   Initialize with: 
   ✅ Add a README file
   ✅ Add .gitignore (Node template)
   ✅ Choose a license (MIT)
   ```

### Option B: Create from Command Line (GitHub CLI)

```bash
# Install GitHub CLI first: https://cli.github.com/
gh auth login
gh repo create devops-todo-app --public --description "DevOps learning project"
```

## 🔧 Step 2: Clone and Setup Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/devops-todo-app.git
cd devops-todo-app

# Configure Git user (if not done globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify remote connection
git remote -v
```

## 📁 Step 3: Setup Project Structure

Create the complete project structure locally:

```bash
# Create directory structure
mkdir -p backend/src/{routes,database,__tests__}
mkdir -p frontend/src/{components,services,__tests__}
mkdir -p .github/workflows
mkdir -p docs
mkdir -p scripts

# Create initial files
touch backend/src/server.js
touch frontend/src/App.jsx
touch .github/workflows/ci.yml
touch docs/getting-started.md
```

## 🔄 Step 4: Git Workflow Setup

### Configure Branch Protection

1. Go to **Settings** → **Branches** in your GitHub repo
2. **Add branch protection rule** for `main`:
   ```
   ✅ Require a pull request before merging
   ✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   ✅ Include administrators
   ```

### Setup Development Branch

```bash
# Create and switch to develop branch
git checkout -b develop
git push -u origin develop

# Set develop as default branch (in GitHub settings)
```

### Git Flow Commands

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/todo-api

# Make changes, then commit
git add .
git commit -m "feat: add todo API endpoints"

# Push feature branch
git push -u origin feature/todo-api

# Create Pull Request (via GitHub web or CLI)
gh pr create --title "Add Todo API" --body "Implements CRUD operations for todos"
```

## ⚙️ Step 5: GitHub Actions CI/CD Setup

### Basic CI Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

env:
  NODE_VERSION: '18'

jobs:
  test-backend:
    name: Backend Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Linting
        run: npm run lint
      
      - name: Run Tests
        run: npm run test:coverage
      
      - name: Upload Coverage Reports
        uses: codecov/codecov-action@v3
        with:
          directory: ./backend/coverage

  test-frontend:
    name: Frontend Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Linting
        run: npm run lint
      
      - name: Run Tests
        run: npm run test:coverage
      
      - name: Build Application
        run: npm run build
      
      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist/

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy Application
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Build Backend
        run: |
          cd backend
          npm ci --production
      
      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './frontend/dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔐 Step 6: GitHub Secrets Management

### Setup Required Secrets

Go to **Settings** → **Secrets and variables** → **Actions**:

```bash
# Repository secrets to add:
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
RAILWAY_TOKEN=your_railway_token  # If using Railway for backend
```

### Environment-Specific Secrets

Create environments (Production, Staging) with specific secrets:

1. Go to **Settings** → **Environments**
2. **Create environment** named "production"
3. **Add environment secrets**:
   ```
   DATABASE_URL=production_database_url
   API_URL=https://api.yourdomain.com
   JWT_SECRET=super_secure_secret
   ```

## 📊 Step 7: GitHub Features for DevOps

### GitHub Projects (Project Management)

1. **Create new project** in your repository
2. **Setup automation**:
   ```
   - Auto-add new issues and PRs
   - Move to "In Progress" when PR is opened
   - Move to "Done" when PR is merged
   ```

### GitHub Issues Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: 'bug'
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]
```

### Pull Request Template

Create `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Tested in browser

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## 🔄 Step 8: Daily Development Workflow

### Feature Development Process

```bash
# 1. Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/add-todo-categories

# 2. Develop and test locally
# ... make changes ...
npm test  # Ensure tests pass

# 3. Commit with conventional commits
git add .
git commit -m "feat: add category support to todos"

# 4. Push and create PR
git push -u origin feature/add-todo-categories
gh pr create --title "Add Todo Categories" --body "Implements category filtering for todos"

# 5. After PR approval and CI passes, merge via GitHub
# 6. Clean up local branch
git checkout develop
git pull origin develop
git branch -d feature/add-todo-categories
```

### Hotfix Process

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Fix the issue
# ... make fix ...

# 3. Test and commit
npm test
git add .
git commit -m "fix: resolve critical security vulnerability"

# 4. Push and create urgent PR
git push -u origin hotfix/critical-bug-fix
gh pr create --title "URGENT: Security Fix" --base main

# 5. After merge, sync develop
git checkout develop
git merge main
```

## 📈 Step 9: Monitoring and Analytics

### GitHub Insights

Monitor your project health:
- **Pulse**: Overview of repository activity
- **Contributors**: See who's contributing
- **Traffic**: View repository visits and clones
- **Dependency graph**: Track dependencies

### Status Badges

Add to your README.md:

```markdown
![CI Status](https://github.com/username/devops-todo-app/workflows/CI/badge.svg)
![Deploy Status](https://github.com/username/devops-todo-app/workflows/Deploy/badge.svg)
[![codecov](https://codecov.io/gh/username/devops-todo-app/branch/main/graph/badge.svg)](https://codecov.io/gh/username/devops-todo-app)
```

## 🔧 Step 10: Advanced GitHub Actions

### Matrix Strategy for Multiple Environments

```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

### Conditional Deployments

```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  # ... deploy to staging

deploy-production:
  if: github.ref == 'refs/heads/main'
  # ... deploy to production
```

### Scheduled Workflows

```yaml
on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM
```

## 🎯 Best Practices Summary

### Git Best Practices
- Use meaningful commit messages
- Keep commits small and focused
- Use feature branches for all changes
- Rebase feature branches before merging
- Protect main/develop branches

### GitHub Actions Best Practices
- Use official actions when possible
- Cache dependencies to speed up builds
- Use secrets for sensitive data
- Fail fast - run quick tests first
- Use matrix builds for multiple environments

### Collaboration Best Practices
- Use issue templates
- Require code reviews
- Use descriptive PR titles and descriptions
- Tag releases with semantic versioning
- Document everything

## 🚀 Getting Started Commands

```bash
# Quick setup for new contributors
git clone https://github.com/YOUR_USERNAME/devops-todo-app.git
cd devops-todo-app
npm run setup  # Installs all dependencies
npm run verify # Runs setup verification
npm run dev    # Starts development servers
```

This setup provides a complete DevOps learning environment using Git, GitHub, and GitHub Actions! 🎉 