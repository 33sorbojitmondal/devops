# Deployment Guide

This guide covers various deployment strategies and platforms for the DevOps Todo application, from simple hosting to advanced CI/CD deployments.

## 🎯 Deployment Options

### Development Environment
- **Frontend**: Vite dev server (localhost:5173)
- **Backend**: Node.js with nodemon (localhost:3001)
- **Database**: SQLite file

### Production Environment
- **Frontend**: Static files served by CDN or web server
- **Backend**: Node.js process manager (PM2) or containerized
- **Database**: SQLite, PostgreSQL, or cloud database

## 🚀 Quick Deployment Options

### Option 1: Netlify + Railway (Recommended for Beginners)

**Frontend on Netlify (Free)**

1. Fork/clone this repository
2. Sign up at [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Configure build settings:
   ```
   Build command: cd frontend && npm install && npm run build
   Publish directory: frontend/dist
   ```
5. Add environment variables:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

**Backend on Railway (Free tier available)**

1. Sign up at [railway.app](https://railway.app)
2. Deploy from GitHub repository
3. Select the backend folder
4. Railway will auto-detect Node.js and deploy
5. Set environment variables in Railway dashboard

### Option 2: Vercel + PlanetScale

**Frontend on Vercel**

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure for monorepo:
   ```json
   // vercel.json
   {
     "builds": [
       {
         "src": "frontend/package.json",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "frontend/$1"
       }
     ]
   }
   ```

**Backend on Vercel Serverless**

1. Create API routes in `api/` folder
2. Deploy as serverless functions
3. Configure database connection

### Option 3: Heroku (Simple but Paid)

1. Install Heroku CLI
2. Create Heroku apps:
   ```bash
   heroku create your-app-backend
   heroku create your-app-frontend
   ```
3. Deploy with git:
   ```bash
   git subtree push --prefix backend heroku-backend main
   git subtree push --prefix frontend heroku-frontend main
   ```

## 🔧 Manual Deployment Setup

### Prerequisites

```bash
# Install Node.js and npm
node --version  # Should be v16+
npm --version

# Install PM2 for process management
npm install -g pm2
```

### Backend Deployment

1. **Prepare the server**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm nginx

   # CentOS/RHEL
   sudo yum install nodejs npm nginx
   ```

2. **Clone and setup**:
   ```bash
   git clone https://github.com/your-username/devops-todo-app.git
   cd devops-todo-app/backend
   npm install --production
   cp .env.example .env
   # Edit .env with production values
   ```

3. **Start with PM2**:
   ```bash
   pm2 start src/server.js --name "todo-backend"
   pm2 startup  # Enable auto-start
   pm2 save     # Save current processes
   ```

4. **Configure Nginx**:
   ```nginx
   # /etc/nginx/sites-available/todo-api
   server {
       listen 80;
       server_name your-api-domain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend Deployment

1. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Configure web server**:
   ```nginx
   # /etc/nginx/sites-available/todo-frontend
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/frontend/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **Enable sites**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/todo-frontend /etc/nginx/sites-enabled/
   sudo ln -s /etc/nginx/sites-available/todo-api /etc/nginx/sites-enabled/
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```

## 🐳 Docker Deployment

### Dockerfiles

**Backend Dockerfile**:
```dockerfile
# backend/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY data/ ./data/

EXPOSE 3001

USER node

CMD ["npm", "start"]
```

**Frontend Dockerfile**:
```dockerfile
# frontend/Dockerfile
FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Update deployment
docker-compose pull
docker-compose up -d --no-deps
```

## ⚙️ CI/CD Deployment

### GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json
      
      - name: Build Backend
        run: |
          cd backend
          npm ci
          npm run test
      
      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run test
          npm run build
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/app
            git pull origin main
            cd backend && npm ci --production
            cd ../frontend && npm ci && npm run build
            pm2 restart todo-backend
            sudo systemctl reload nginx
```

### Environment Variables

Set these secrets in GitHub repository settings:

```bash
# Production secrets
HOST=your-server-ip
USERNAME=deploy-user
SSH_KEY=your-private-ssh-key
DATABASE_URL=your-production-database-url
API_URL=https://api.yourdomain.com
```

## 🔒 Security Considerations

### SSL/TLS Setup

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Headers

```nginx
# Add to Nginx server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Environment Security

```bash
# Secure .env files
chmod 600 .env
chown app:app .env

# Use secrets management
# - AWS Secrets Manager
# - Azure Key Vault
# - Google Secret Manager
```

## 📊 Monitoring and Logging

### Application Monitoring

```javascript
// Add to backend/src/server.js
const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

### Log Aggregation

```bash
# Install and configure logrotate
sudo nano /etc/logrotate.d/todo-app

# Content:
/var/log/todo-app/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 app app
    postrotate
        pm2 reload todo-backend
    endscript
}
```

### Uptime Monitoring

Free monitoring services:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

## 🎯 Deployment Strategies

### Blue-Green Deployment

```bash
#!/bin/bash
# deploy-blue-green.sh

# Build new version
git pull origin main
cd frontend && npm run build && cd ..

# Switch to blue environment
sudo ln -sfn /var/www/todo-blue /var/www/todo-current
sudo systemctl reload nginx

# Test blue environment
if curl -f http://localhost/health; then
    echo "Blue deployment successful"
    # Cleanup green
    rm -rf /var/www/todo-green
else
    echo "Blue deployment failed, rolling back"
    sudo ln -sfn /var/www/todo-green /var/www/todo-current
    sudo systemctl reload nginx
    exit 1
fi
```

### Rolling Deployment

```bash
#!/bin/bash
# rolling-deploy.sh

# Update each instance one by one
for instance in instance1 instance2 instance3; do
    echo "Updating $instance..."
    ssh $instance "cd /app && git pull && npm install && pm2 restart todo-backend"
    
    # Health check
    if ! curl -f http://$instance/health; then
        echo "Health check failed for $instance"
        exit 1
    fi
    
    sleep 30  # Wait before next instance
done
```

## 🔧 Troubleshooting Deployment

### Common Issues

**Build Failures**
```bash
# Clear caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Permission Issues**
```bash
# Fix ownership
sudo chown -R app:app /var/www/todo-app
sudo chmod -R 755 /var/www/todo-app
```

**Database Connection Issues**
```bash
# Check database connectivity
nc -zv database-host 5432  # PostgreSQL
telnet database-host 3306  # MySQL
```

**SSL Certificate Issues**
```bash
# Test SSL configuration
sudo certbot certificates
sudo nginx -t
openssl s_client -connect yourdomain.com:443
```

### Rollback Procedures

```bash
# Quick rollback with git
git log --oneline -10  # Find commit to rollback to
git checkout COMMIT_HASH
pm2 restart todo-backend
sudo systemctl reload nginx

# Rollback with backups
cp /backup/todo-app-$(date -d "1 day ago" +%Y%m%d).tar.gz .
tar -xzf todo-app-*.tar.gz
pm2 restart todo-backend
```

## 📚 Additional Resources

- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Let's Encrypt Guide](https://letsencrypt.org/getting-started/)

Remember: Always test deployments in a staging environment first! 🚀 