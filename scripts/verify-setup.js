#!/usr/bin/env node

/**
 * DevOps Todo App - Setup Verification Script
 * 
 * This script verifies that the development environment is properly configured
 * and all necessary dependencies are installed.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command, description) {
  try {
    execSync(command, { stdio: 'ignore' });
    log(`✅ ${description}`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkNodeModules(projectPath, projectName) {
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log(`✅ ${projectName} dependencies installed`, 'green');
    return true;
  } else {
    log(`❌ ${projectName} dependencies not installed`, 'red');
    log(`   Run: cd ${projectPath} && npm install`, 'yellow');
    return false;
  }
}

async function checkPort(port, description) {
  try {
    const response = await fetch(`http://localhost:${port}/health`).catch(() => null);
    if (response && response.ok) {
      log(`✅ ${description} is running on port ${port}`, 'green');
      return true;
    } else {
      log(`⚠️  ${description} not running on port ${port}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`⚠️  ${description} not running on port ${port}`, 'yellow');
    return false;
  }
}

function main() {
  log('\n🔍 DevOps Todo App - Setup Verification\n', 'bold');
  
  let allChecks = true;
  
  // Check system requirements
  log('📋 System Requirements:', 'blue');
  allChecks &= checkCommand('node --version', 'Node.js is installed');
  allChecks &= checkCommand('npm --version', 'npm is installed');
  allChecks &= checkCommand('git --version', 'Git is installed');
  
  // Check Node.js version
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion >= 16) {
      log(`✅ Node.js version ${nodeVersion} (>= 16.0.0)`, 'green');
    } else {
      log(`❌ Node.js version ${nodeVersion} (requires >= 16.0.0)`, 'red');
      allChecks = false;
    }
  } catch (error) {
    log('❌ Unable to check Node.js version', 'red');
    allChecks = false;
  }
  
  console.log();
  
  // Check project structure
  log('📁 Project Structure:', 'blue');
  allChecks &= checkDirectory('backend', 'Backend directory exists');
  allChecks &= checkDirectory('frontend', 'Frontend directory exists');
  allChecks &= checkDirectory('.github/workflows', 'GitHub Actions workflows directory exists');
  allChecks &= checkDirectory('docs', 'Documentation directory exists');
  
  console.log();
  
  // Check configuration files
  log('⚙️  Configuration Files:', 'blue');
  allChecks &= checkFile('backend/package.json', 'Backend package.json exists');
  allChecks &= checkFile('frontend/package.json', 'Frontend package.json exists');
  allChecks &= checkFile('backend/.env.example', 'Backend .env.example exists');
  allChecks &= checkFile('.github/workflows/ci.yml', 'CI workflow file exists');
  allChecks &= checkFile('.gitignore', '.gitignore file exists');
  
  // Check if .env file exists for backend
  if (fs.existsSync('backend/.env')) {
    log('✅ Backend .env file exists', 'green');
  } else {
    log('⚠️  Backend .env file not found', 'yellow');
    log('   Copy from .env.example: cp backend/.env.example backend/.env', 'yellow');
  }
  
  console.log();
  
  // Check dependencies
  log('📦 Dependencies:', 'blue');
  allChecks &= checkNodeModules('backend', 'Backend');
  allChecks &= checkNodeModules('frontend', 'Frontend');
  
  console.log();
  
  // Check if servers are running
  log('🚀 Running Services:', 'blue');
  // Note: We can't use async/await in this context easily, so we'll skip the port checks
  log('   To check if services are running:', 'yellow');
  log('   - Backend: curl http://localhost:3001/health', 'yellow');
  log('   - Frontend: open http://localhost:5173', 'yellow');
  
  console.log();
  
  // Summary
  if (allChecks) {
    log('🎉 All checks passed! Your environment is ready for development.', 'green');
    log('\nNext steps:', 'blue');
    log('1. Start the backend: cd backend && npm run dev', 'reset');
    log('2. Start the frontend: cd frontend && npm run dev', 'reset');
    log('3. Open http://localhost:5173 in your browser', 'reset');
    log('4. Read the documentation in docs/getting-started.md', 'reset');
  } else {
    log('⚠️  Some checks failed. Please resolve the issues above.', 'yellow');
    log('\nCommon solutions:', 'blue');
    log('- Install Node.js from https://nodejs.org/', 'reset');
    log('- Run "npm install" in backend and frontend directories', 'reset');
    log('- Copy backend/.env.example to backend/.env', 'reset');
    log('- Check the getting started guide in docs/getting-started.md', 'reset');
  }
  
  console.log();
}

// Run the verification
main(); 