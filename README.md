# DevOps Learning Project: Todo App

A full-stack Todo application designed for learning DevOps fundamentals including Git workflows, CI/CD pipelines, automated testing, and deployment strategies.

## 🎯 Project Overview

This project provides a hands-on environment to learn DevOps practices through a real-world application. You'll master Git workflows, GitHub Actions, automated testing, code quality gates, and various deployment strategies.

### What You'll Build
- **Frontend**: React application with Vite
- **Backend**: Node.js Express API with SQLite
- **CI/CD**: GitHub Actions workflows
- **Testing**: Automated test suites
- **Deployment**: Multiple deployment options

### What You'll Learn
- ✅ Git branching strategies and pull request workflows
- ✅ Continuous Integration with GitHub Actions
- ✅ Automated testing and quality gates
- ✅ Code review processes
- ✅ Deployment automation
- ✅ Monitoring and logging
- ✅ Security best practices

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **GitHub Account** ([Sign up](https://github.com/))

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/devops-todo-app.git
cd devops-todo-app

# Setup backend
cd backend
npm install
cp .env.example .env
npm run dev  # Starts on http://localhost:3001

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

### 2. Verify Setup
- Open `http://localhost:5173` in your browser
- Create a todo item to test the full stack
- Check that the item persists after page refresh

## 📁 Project Structure

```
devops-todo-app/
├── 📁 backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── database/          # Database setup
│   │   ├── __tests__/         # Backend tests
│   │   └── server.js          # Main server file
│   ├── package.json
│   └── .env.example
│
├── 📁 frontend/                # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── __tests__/         # Frontend tests
│   │   └── App.jsx
│   ├── package.json
│   └── index.html
│
├── 📁 .github/workflows/       # CI/CD pipelines
│   └── ci.yml                 # Main workflow
│
├── 📁 docs/                   # Documentation
│   ├── getting-started.md     # Detailed setup guide
│   ├── git-workflow.md        # Git best practices
│   └── deployment.md          # Deployment guide
│
├── .gitignore
└── README.md                  # This file
```

## 🔄 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/add-priority-levels

# Make changes and test
npm test  # Run tests
npm run lint  # Check code style

# Commit with conventional format
git commit -m "feat: add priority levels to todos"

# Push and create PR
git push origin feature/add-priority-levels
```

### 2. Code Review Process
- Create Pull Request on GitHub
- Automated CI checks run
- Team reviews code
- Merge after approval and passing tests

### 3. Automated CI/CD
The GitHub Actions workflow automatically:
- ✅ Installs dependencies
- ✅ Runs linting and formatting checks
- ✅ Executes test suites
- ✅ Builds applications
- ✅ Runs security scans
- ✅ Deploys to staging/production

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test              # Run all tests
npm run test:ui       # Interactive UI
```

### Integration Tests
```bash
# Run full test suite
npm run test:integration
```

## 🚀 Deployment Options

### Option 1: Cloud Platforms (Recommended)
- **Frontend**: Netlify, Vercel, or GitHub Pages
- **Backend**: Railway, Heroku, or DigitalOcean

### Option 2: Docker
```bash
docker-compose up -d
```

### Option 3: Manual Server
See [`docs/deployment.md`](docs/deployment.md) for detailed instructions.

## 🛠️ Available Scripts

### Backend Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Fix code style issues |

### Frontend Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run lint` | Check code style |

## 🎓 Learning Path

### Week 1: Git Fundamentals
- [ ] Fork and clone repository
- [ ] Create feature branches
- [ ] Practice commit conventions
- [ ] Submit first pull request

### Week 2: CI/CD Basics
- [ ] Understand GitHub Actions workflow
- [ ] Break and fix tests
- [ ] Experience quality gates
- [ ] Learn deployment automation

### Week 3: Advanced DevOps
- [ ] Add monitoring and logging
- [ ] Implement security scanning
- [ ] Practice deployment strategies
- [ ] Set up alerts and notifications

**📖 Detailed guides available in [`docs/getting-started.md`](docs/getting-started.md)**

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
# Database will be created at: ./data/todos.db
```

**Frontend** (environment):
```bash
VITE_API_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
We use [Conventional Commits](https://conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `test:` Test changes
- `refactor:` Code refactoring
- `ci:` CI/CD changes

## 📊 Project Status

![CI Status](https://github.com/your-username/devops-todo-app/workflows/CI/badge.svg)
![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

### Current Features
- ✅ Create, read, update, delete todos
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Automated testing
- ✅ CI/CD pipeline
- ✅ Multiple deployment options

### Planned Features
- 🔄 User authentication
- 🔄 Due dates and priorities
- 🔄 Categories and tags
- 🔄 Team collaboration
- 🔄 Mobile app

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- CORS configuration
- Security headers
- Dependency vulnerability scanning

Report security issues to: security@yourdomain.com

## 📚 Resources

### Documentation
- [Getting Started Guide](docs/getting-started.md)
- [Git Workflow Guide](docs/git-workflow.md)
- [Deployment Guide](docs/deployment.md)

### External Resources
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [DevOps Roadmap](https://roadmap.sh/devops)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Backend powered by [Express.js](https://expressjs.com/)
- CI/CD with [GitHub Actions](https://github.com/features/actions)
- Testing with [Vitest](https://vitest.dev/) and [Jest](https://jestjs.io/)

---

**Ready to start your DevOps journey?** 🚀

1. Star ⭐ this repository
2. Fork it to your account
3. Follow the [Getting Started Guide](docs/getting-started.md)
4. Build something amazing!

**Questions?** Open an issue or start a discussion. We're here to help! 💬 