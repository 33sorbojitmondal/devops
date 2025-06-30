# Getting Started with DevOps Learning

This guide will walk you through setting up and using this Todo application to learn DevOps fundamentals with Git, GitHub, and GitHub Actions.

## 🎯 What You'll Learn

- **Git Workflows**: Feature branches, pull requests, code reviews
- **GitHub Actions**: Continuous Integration and Continuous Deployment (CI/CD)
- **Full-Stack Development**: React frontend + Node.js backend
- **Testing**: Automated testing in CI/CD pipelines
- **Code Quality**: Linting, formatting, and quality gates
- **Deployment**: Automated deployment strategies

## 📋 Prerequisites

### Required Software
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

### Knowledge Requirements
- Basic JavaScript knowledge
- Basic command line usage
- Basic understanding of web development

### Free GitHub Account
- Sign up at [github.com](https://github.com)
- Enable GitHub Actions (free tier includes 2,000 minutes/month)

## 🚀 Quick Setup

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/devops-todo-app.git
cd devops-todo-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Copy environment variables
npm run dev           # Start development server
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run dev          # Start development server
```

The frontend will run on `http://localhost:5173`

### 4. Verify Everything Works

- Open `http://localhost:5173` in your browser
- You should see the Todo application
- Try adding a new todo to test the full stack

## 🔄 DevOps Learning Path

### Week 1: Git Fundamentals

**Goal**: Master basic Git workflows

**Tasks**:
1. Create a feature branch:
   ```bash
   git checkout -b feature/add-your-name
   ```

2. Make a small change (add your name to README)
3. Commit with conventional commit format:
   ```bash
   git commit -m "docs: add contributor name to README"
   ```

4. Push and create your first Pull Request
5. Experience the code review process

**Learning Points**:
- Branch strategies
- Commit message conventions
- Pull request workflow
- Code reviews

### Week 2: GitHub Actions Basics

**Goal**: Understand CI/CD pipelines

**Tasks**:
1. Examine `.github/workflows/ci.yml`
2. Make a change that breaks tests
3. See how CI prevents bad code from merging
4. Fix the issue and watch CI pass

**Learning Points**:
- Automated testing
- Quality gates
- Continuous Integration
- Build pipelines

### Week 3: Testing and Quality

**Goal**: Implement comprehensive testing

**Tasks**:
1. Add a new test case:
   ```bash
   cd backend
   # Add test in src/__tests__/
   npm test
   ```

2. Improve test coverage
3. Add linting rules
4. See quality metrics in action

**Learning Points**:
- Test-driven development
- Code coverage
- Linting and formatting
- Quality metrics

### Week 4: Deployment Automation

**Goal**: Automate deployment processes

**Tasks**:
1. Set up deployment to a free hosting service
2. Configure environment-specific deployments
3. Practice rollback procedures
4. Monitor deployment metrics

**Learning Points**:
- Continuous Deployment
- Environment management
- Blue-green deployments
- Monitoring and logging

### Week 5: Advanced DevOps

**Goal**: Implement advanced DevOps practices

**Tasks**:
1. Add security scanning
2. Implement feature flags
3. Set up monitoring and alerting
4. Practice incident response

**Learning Points**:
- Security in CI/CD
- Feature toggles
- Infrastructure as Code
- Incident management

## 🛠️ Common Commands

### Development Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code style
npm run lint:fix     # Fix code style issues

# Frontend
cd frontend
npm run dev          # Start development server
npm test             # Run tests
npm run build        # Build for production
npm run preview      # Preview production build
```

### Git Commands

```bash
# Daily workflow
git status                          # Check current status
git add .                          # Stage all changes
git commit -m "type: description"  # Commit with message
git push origin feature-branch     # Push to remote

# Branch management
git checkout -b feature/new-feature # Create new branch
git checkout main                   # Switch to main
git merge feature/new-feature      # Merge branch
git branch -d feature/new-feature  # Delete branch

# Staying up to date
git pull origin main               # Get latest changes
git rebase main                    # Rebase current branch
```

## 🔍 Project Structure Explained

```
devops-todo-app/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── database/          # Database configuration
│   │   ├── __tests__/         # Backend tests
│   │   └── server.js          # Express server setup
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   ├── __tests__/         # Frontend tests
│   │   └── App.jsx            # Main React component
│   ├── package.json           # Frontend dependencies
│   └── index.html             # HTML template
│
├── .github/
│   └── workflows/             # GitHub Actions workflows
│       └── ci.yml             # Main CI/CD pipeline
│
├── docs/                      # Documentation
│   ├── getting-started.md     # This file
│   ├── git-workflow.md        # Git workflow guide
│   └── deployment.md          # Deployment guide
│
├── .gitignore                 # Git ignore rules
└── README.md                  # Project overview
```

## 🎯 Learning Exercises

### Exercise 1: First Feature
Create a feature to add due dates to todos:
1. Create feature branch
2. Add due date field to backend
3. Add due date UI to frontend
4. Write tests
5. Create pull request
6. Go through review process

### Exercise 2: Fix a Bug
Introduce and fix a bug:
1. Create a bug (e.g., todos not deleting)
2. Write a test that reproduces the bug
3. Fix the bug
4. Verify test passes
5. Deploy fix

### Exercise 3: Improve CI/CD
Enhance the pipeline:
1. Add code coverage reporting
2. Add security scanning
3. Add performance testing
4. Add deployment to staging

## 🆘 Troubleshooting

### Common Issues

**"npm install" fails**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and try again
rm -rf node_modules
npm install
```

**Port already in use**
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3001   # Windows
```

**Git authentication issues**
```bash
# Use personal access token instead of password
git config --global credential.helper store
```

**CI tests failing**
- Check the Actions tab in GitHub
- Look at the specific failed step
- Run tests locally to reproduce
- Fix issues and push again

### Getting Help

1. **Documentation**: Check the `docs/` folder
2. **GitHub Issues**: Create an issue with details
3. **GitHub Discussions**: Ask questions in discussions
4. **Stack Overflow**: Tag with `devops`, `github-actions`

## 🎉 Next Steps

Once you're comfortable with this project:

1. **Scale Up**: Try the same patterns on a larger project
2. **Explore Tools**: Learn Docker, Kubernetes, Terraform
3. **Cloud Platforms**: Try AWS, Azure, or Google Cloud
4. **Monitoring**: Add application performance monitoring
5. **Security**: Implement security best practices

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Git Tutorial](https://git-scm.com/docs/gittutorial)
- [DevOps Roadmap](https://roadmap.sh/devops)
- [The Phoenix Project](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262592) (Book)

Happy learning! 🚀 