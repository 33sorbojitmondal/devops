# Git Workflow Guide

This guide explains the Git workflow used in this DevOps learning project.

## Branch Strategy

We use a **Feature Branch Workflow** which is perfect for learning and small teams:

```
main          ←── Protected branch, always deployable
  ↑
develop       ←── Integration branch for features
  ↑
feature/*     ←── Feature branches for new work
```

## Workflow Steps

### 1. Setting Up Your Local Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd devops-todo-app

# Set up remote tracking
git remote -v
```

### 2. Starting New Work

```bash
# Always start from the latest develop branch
git checkout develop
git pull origin develop

# Create a new feature branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/add-todo-priority
git checkout -b bugfix/fix-todo-deletion
git checkout -b docs/update-readme
```

### 3. Making Changes

```bash
# Make your changes, then stage them
git add .

# Commit with a descriptive message
git commit -m "feat: add priority field to todos"

# Follow conventional commit format:
# feat: new feature
# fix: bug fix
# docs: documentation changes
# style: formatting changes
# refactor: code changes that neither fix bugs nor add features
# test: adding or modifying tests
# chore: changes to build process or auxiliary tools
```

### 4. Pushing Your Branch

```bash
# Push your feature branch to remote
git push origin feature/your-feature-name

# If it's the first push for this branch
git push -u origin feature/your-feature-name
```

### 5. Creating a Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your feature branch → develop
4. Fill out the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Testing**: How you tested the changes
   - **Screenshots**: If UI changes were made

### 6. Code Review Process

- At least one reviewer must approve
- All CI checks must pass
- Address any requested changes
- Update your branch if needed:

```bash
# Make requested changes
git add .
git commit -m "fix: address review comments"
git push origin feature/your-feature-name
```

### 7. Merging

Once approved:
1. Squash and merge into develop
2. Delete the feature branch
3. Pull latest develop locally:

```bash
git checkout develop
git pull origin develop
git branch -d feature/your-feature-name
```

## Commit Message Guidelines

Use **Conventional Commits** format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples:

```bash
feat: add user authentication
fix: resolve todo deletion bug
docs: update API documentation
style: format code with prettier
refactor: simplify todo validation logic
test: add integration tests for API
chore: update dependencies
```

## Best Practices

### 1. Keep Commits Small and Focused
- One logical change per commit
- Easier to review and revert if needed

### 2. Write Clear Commit Messages
- Use present tense: "add feature" not "added feature"
- Be descriptive but concise
- Explain **what** and **why**, not **how**

### 3. Test Before Committing
```bash
# Run tests
npm test

# Run linting
npm run lint

# Build the project
npm run build
```

### 4. Keep Branches Up to Date
```bash
# Before creating PR, rebase on latest develop
git checkout develop
git pull origin develop
git checkout feature/your-branch
git rebase develop
```

### 5. Use .gitignore Properly
Already configured for:
- Node.js dependencies (`node_modules/`)
- Environment files (`.env`)
- Build outputs (`dist/`, `build/`)
- IDE files (`.vscode/`, `.idea/`)
- Database files (`*.db`)

## Troubleshooting

### Merge Conflicts
```bash
# If you have conflicts during rebase
git status  # see conflicted files
# Edit files to resolve conflicts
git add .
git rebase --continue
```

### Accidentally Committed to Wrong Branch
```bash
# Move last commit to correct branch
git reset --soft HEAD~1
git stash
git checkout correct-branch
git stash pop
git add .
git commit
```

### Need to Update PR Branch
```bash
# Option 1: Rebase (cleaner history)
git checkout develop
git pull origin develop
git checkout feature/your-branch
git rebase develop
git push --force-with-lease origin feature/your-branch

# Option 2: Merge (safer)
git checkout feature/your-branch
git merge develop
git push origin feature/your-branch
```

## GitHub Integration

### Branch Protection Rules
- `main` branch requires:
  - Pull request reviews
  - Status checks to pass
  - Branch to be up to date
  - No direct pushes allowed

### Automated Actions
- CI runs on every push/PR
- Deployment happens on merge to main
- Security scans on schedule

This workflow ensures code quality, enables collaboration, and provides learning opportunities for DevOps practices! 