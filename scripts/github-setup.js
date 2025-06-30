#!/usr/bin/env node

/**
 * GitHub Setup Helper Script
 * 
 * This script helps automate the setup of the DevOps Todo App on GitHub
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    log('✅ GitHub CLI is installed', 'green');
    return true;
  } catch (error) {
    log('❌ GitHub CLI not found', 'red');
    log('   Install from: https://cli.github.com/', 'yellow');
    return false;
  }
}

function checkGitRepo() {
  try {
    execSync('git status', { stdio: 'ignore' });
    log('✅ Git repository initialized', 'green');
    return true;
  } catch (error) {
    log('❌ Not a Git repository', 'red');
    log('   Run: git init', 'yellow');
    return false;
  }
}

function checkGitHubAuth() {
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    log('✅ GitHub CLI authenticated', 'green');
    return true;
  } catch (error) {
    log('❌ GitHub CLI not authenticated', 'red');
    log('   Run: gh auth login', 'yellow');
    return false;
  }
}

function createGitHubRepo(repoName, description) {
  try {
    log(`Creating GitHub repository: ${repoName}`, 'blue');
    execSync(`gh repo create ${repoName} --public --description "${description}" --clone=false`, 
             { stdio: 'inherit' });
    log('✅ GitHub repository created successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to create GitHub repository', 'red');
    log('   You may need to create it manually at github.com', 'yellow');
    return false;
  }
}

function setupRemote(username, repoName) {
  try {
    const remoteUrl = `https://github.com/${username}/${repoName}.git`;
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'ignore' });
    log('✅ Git remote origin added', 'green');
    return true;
  } catch (error) {
    log('⚠️  Git remote may already exist', 'yellow');
    return true;
  }
}

function createDevBranch() {
  try {
    execSync('git checkout -b develop', { stdio: 'ignore' });
    log('✅ Develop branch created', 'green');
    return true;
  } catch (error) {
    log('⚠️  Develop branch may already exist', 'yellow');
    return true;
  }
}

function initialCommit() {
  try {
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "feat: initial project setup with DevOps infrastructure"', 
             { stdio: 'ignore' });
    log('✅ Initial commit created', 'green');
    return true;
  } catch (error) {
    log('⚠️  Initial commit may already exist', 'yellow');
    return true;
  }
}

function pushToGitHub() {
  try {
    execSync('git push -u origin main', { stdio: 'inherit' });
    execSync('git push -u origin develop', { stdio: 'inherit' });
    log('✅ Code pushed to GitHub', 'green');
    return true;
  } catch (error) {
    log('❌ Failed to push to GitHub', 'red');
    return false;
  }
}

function setupBranchProtection(repoName) {
  try {
    log('Setting up branch protection rules...', 'blue');
    const protectionRule = {
      required_status_checks: {
        strict: true,
        contexts: ['test-backend', 'test-frontend', 'security-scan']
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        dismiss_stale_reviews: true
      },
      restrictions: null
    };
    
    // Note: This would require the GitHub API, simplified for demo
    log('⚠️  Set up branch protection manually in GitHub Settings → Branches', 'yellow');
    return true;
  } catch (error) {
    log('❌ Failed to setup branch protection', 'red');
    return false;
  }
}

function createLabels(repoName) {
  const labels = [
    { name: 'bug', color: 'd73a4a', description: 'Something isn\'t working' },
    { name: 'enhancement', color: 'a2eeef', description: 'New feature or request' },
    { name: 'good first issue', color: '7057ff', description: 'Good for newcomers' },
    { name: 'help wanted', color: '008672', description: 'Extra attention is needed' },
    { name: 'documentation', color: '0075ca', description: 'Improvements or additions to documentation' },
    { name: 'ci/cd', color: 'f9d71c', description: 'Related to CI/CD pipeline' },
    { name: 'security', color: 'b60205', description: 'Security related issue' },
    { name: 'performance', color: 'fbca04', description: 'Performance improvements' }
  ];

  try {
    log('Creating GitHub labels...', 'blue');
    labels.forEach(label => {
      try {
        execSync(`gh label create "${label.name}" --color ${label.color} --description "${label.description}" --repo ${repoName}`, 
                 { stdio: 'ignore' });
      } catch (error) {
        // Label might already exist
      }
    });
    log('✅ GitHub labels created', 'green');
    return true;
  } catch (error) {
    log('⚠️  Some labels may already exist', 'yellow');
    return true;
  }
}

function enableGitHubFeatures(repoName) {
  try {
    log('Enabling GitHub features...', 'blue');
    // Enable issues, wikis, projects
    execSync(`gh repo edit ${repoName} --enable-issues --enable-wiki --enable-projects`, 
             { stdio: 'ignore' });
    log('✅ GitHub features enabled', 'green');
    return true;
  } catch (error) {
    log('⚠️  Some features may already be enabled', 'yellow');
    return true;
  }
}

function displayNextSteps(username, repoName) {
  log('\n🎉 GitHub setup complete! Next steps:', 'bold');
  log('', 'reset');
  
  log('1. View your repository:', 'cyan');
  log(`   https://github.com/${username}/${repoName}`, 'reset');
  log('', 'reset');
  
  log('2. Set up branch protection (manually):', 'cyan');
  log(`   Go to: https://github.com/${username}/${repoName}/settings/branches`, 'reset');
  log('   Add rule for "main" branch with:', 'reset');
  log('   - Require pull request reviews', 'reset');
  log('   - Require status checks to pass', 'reset');
  log('   - Include administrators', 'reset');
  log('', 'reset');
  
  log('3. Set up deployment secrets:', 'cyan');
  log(`   Go to: https://github.com/${username}/${repoName}/settings/secrets/actions`, 'reset');
  log('   Add secrets for deployment platforms (Netlify, Railway, etc.)', 'reset');
  log('', 'reset');
  
  log('4. Start developing:', 'cyan');
  log('   git checkout develop', 'reset');
  log('   git checkout -b feature/your-first-feature', 'reset');
  log('   # Make changes, commit, push, create PR', 'reset');
  log('', 'reset');
  
  log('5. Monitor GitHub Actions:', 'cyan');
  log(`   https://github.com/${username}/${repoName}/actions`, 'reset');
  log('', 'reset');
}

async function main() {
  log('\n🚀 DevOps Todo App - GitHub Setup Helper\n', 'bold');
  
  // Get user input
  const username = process.argv[2] || (() => {
    try {
      return execSync('gh api user --jq .login', { encoding: 'utf-8' }).trim();
    } catch {
      return 'your-username';
    }
  })();
  
  const repoName = process.argv[3] || 'devops-todo-app';
  const description = 'DevOps learning project with Todo app - Git, GitHub Actions, CI/CD';
  
  log(`Setting up repository: ${username}/${repoName}`, 'blue');
  log(`Description: ${description}`, 'blue');
  log('', 'reset');
  
  // Pre-flight checks
  log('📋 Pre-flight checks:', 'blue');
  const hasGitHubCLI = checkGitHubCLI();
  const hasGitRepo = checkGitRepo();
  const hasGitHubAuth = checkGitHubAuth();
  
  if (!hasGitHubCLI || !hasGitRepo || !hasGitHubAuth) {
    log('\n❌ Pre-flight checks failed. Please resolve the issues above.', 'red');
    return;
  }
  
  log('\n🔧 Setting up GitHub repository...', 'blue');
  
  // Create GitHub repository
  const repoCreated = createGitHubRepo(repoName, description);
  if (!repoCreated) {
    log('⚠️  Continuing with existing repository...', 'yellow');
  }
  
  // Setup Git
  setupRemote(username, repoName);
  createDevBranch();
  initialCommit();
  
  // Push to GitHub
  const pushed = pushToGitHub();
  if (!pushed) {
    log('⚠️  Manual push required: git push -u origin main && git push -u origin develop', 'yellow');
  }
  
  // Setup GitHub features
  createLabels(`${username}/${repoName}`);
  enableGitHubFeatures(`${username}/${repoName}`);
  setupBranchProtection(`${username}/${repoName}`);
  
  // Display next steps
  displayNextSteps(username, repoName);
}

// Check if script is run directly
if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main }; 