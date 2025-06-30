#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 DevOps Environment Setup\n');

// Check prerequisites
function checkPrerequisites() {
  console.log('📋 Checking prerequisites...\n');
  
  const requirements = [
    { name: 'Node.js', command: 'node --version', minVersion: '16.0.0' },
    { name: 'npm', command: 'npm --version', minVersion: '8.0.0' },
    { name: 'Git', command: 'git --version' },
    { name: 'Docker', command: 'docker --version' },
    { name: 'Docker Compose', command: 'docker-compose --version' }
  ];

  requirements.forEach(req => {
    try {
      const version = execSync(req.command, { encoding: 'utf8' }).trim();
      console.log(`✅ ${req.name}: ${version}`);
    } catch (error) {
      console.log(`❌ ${req.name}: Not installed or not in PATH`);
    }
  });
  console.log();
}

// Setup GitHub secrets documentation
function setupGitHubSecrets() {
  console.log('🔐 GitHub Secrets Setup\n');
  
  const secrets = [
    {
      name: 'CODECOV_TOKEN',
      description: 'Token for code coverage reporting (get from codecov.io)',
      required: false
    },
    {
      name: 'SNYK_TOKEN',
      description: 'Token for Snyk security scanning (get from snyk.io)',
      required: false
    },
    {
      name: 'SLACK_WEBHOOK_URL',
      description: 'Slack webhook URL for notifications',
      required: false
    },
    {
      name: 'HEROKU_API_KEY',
      description: 'Heroku API key for deployment',
      required: false
    },
    {
      name: 'HEROKU_EMAIL',
      description: 'Heroku account email',
      required: false
    }
  ];

  console.log('Add these secrets to your GitHub repository:');
  console.log('Repository → Settings → Secrets and variables → Actions\n');
  
  secrets.forEach(secret => {
    const status = secret.required ? '[REQUIRED]' : '[OPTIONAL]';
    console.log(`${status} ${secret.name}`);
    console.log(`   Description: ${secret.description}\n`);
  });
}

// Create environment files
function createEnvironmentFiles() {
  console.log('📁 Creating environment files...\n');
  
  // Backend .env.example
  const backendEnvExample = `# Backend Environment Variables
NODE_ENV=development
PORT=3000
DB_PATH=./data/todos.db

# Database (if using PostgreSQL)
# DATABASE_URL=postgresql://todouser:todopass@localhost:5432/todos

# Redis (if using caching)
# REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-jwt-secret-here
CORS_ORIGIN=http://localhost:5173

# Monitoring
# SENTRY_DSN=your-sentry-dsn
# NEW_RELIC_LICENSE_KEY=your-newrelic-key
`;

  // Frontend .env.example
  const frontendEnvExample = `# Frontend Environment Variables
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME="DevOps Todo App"
VITE_APP_VERSION=1.0.0

# Analytics (optional)
# VITE_GOOGLE_ANALYTICS_ID=GA-XXXXX-X
# VITE_HOTJAR_ID=XXXXXXX
`;

  try {
    fs.writeFileSync('backend/.env.example', backendEnvExample);
    console.log('✅ Created backend/.env.example');
    
    fs.writeFileSync('frontend/.env.example', frontendEnvExample);
    console.log('✅ Created frontend/.env.example');
    
    // Copy to actual .env files if they don't exist
    if (!fs.existsSync('backend/.env')) {
      fs.writeFileSync('backend/.env', backendEnvExample);
      console.log('✅ Created backend/.env');
    }
    
    if (!fs.existsSync('frontend/.env')) {
      fs.writeFileSync('frontend/.env', frontendEnvExample);
      console.log('✅ Created frontend/.env');
    }
    
  } catch (error) {
    console.log('❌ Error creating environment files:', error.message);
  }
  console.log();
}

// Setup monitoring configuration
function setupMonitoring() {
  console.log('📊 Setting up monitoring...\n');
  
  const prometheusConfig = `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['backend:3000']
  
  - job_name: 'frontend'
    static_configs:
      - targets: ['frontend:80']

  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
`;

  try {
    if (!fs.existsSync('monitoring')) {
      fs.mkdirSync('monitoring');
    }
    
    fs.writeFileSync('monitoring/prometheus.yml', prometheusConfig);
    console.log('✅ Created monitoring/prometheus.yml');
  } catch (error) {
    console.log('❌ Error creating monitoring config:', error.message);
  }
  console.log();
}

// Main setup function
function main() {
  console.log('Starting DevOps environment setup...\n');
  
  checkPrerequisites();
  setupGitHubSecrets();
  createEnvironmentFiles();
  setupMonitoring();
  
  console.log('🎉 DevOps setup completed!\n');
  console.log('Next steps:');
  console.log('1. Configure GitHub secrets (see above)');
  console.log('2. Update repository URLs in package.json');
  console.log('3. Customize deployment targets in workflows');
  console.log('4. Run "npm run verify" to test the setup');
  console.log('5. Push to GitHub to trigger CI/CD pipelines\n');
  
  console.log('🐳 To start with Docker:');
  console.log('   docker-compose up -d\n');
  
  console.log('💻 To start locally:');
  console.log('   npm run dev\n');
}

if (require.main === module) {
  main();
}

module.exports = { checkPrerequisites, setupGitHubSecrets, createEnvironmentFiles }; 