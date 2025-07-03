# 🚀 Deployment Guide

## **Deployment Strategies**

This guide provides two main deployment options:
1. **Docker Deployment** - For AWS, Google Cloud, or personal servers
2. **Platform-as-a-Service (PaaS)** - For Vercel, Railway, or similar services

---

## **Option 1: Docker Deployment**

### **Prerequisites**
- Docker installed on your system
- Cloud provider account (AWS, Google Cloud, DigitalOcean, etc.)
- Domain name (optional but recommended)

### **Step 1: Local Docker Build & Test**

```bash
# Build the production Docker image
docker build -t mcp-server:latest .

# Test locally
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=your_token \
  -e NOTION_API_KEY=your_key \
  -e NOTION_DATABASE_ID=your_database_id \
  -e GITHUB_WEBHOOK_SECRET=your_secret \
  -e NODE_ENV=production \
  mcp-server:latest
```

### **Step 2: AWS EC2 Deployment**

#### **2.1 Launch EC2 Instance**
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

#### **2.2 Deploy Application**
```bash
# Clone your repository
git clone https://github.com/your-username/MCP.git
cd MCP

# Create environment file
cat > .env << EOF
GITHUB_TOKEN=your_production_github_token
NOTION_API_KEY=ntn_your_production_notion_key
NOTION_DATABASE_ID=your_production_database_id
GITHUB_WEBHOOK_SECRET=your_production_webhook_secret
NODE_ENV=production
EOF

# Build and run
docker build -t mcp-server .
docker run -d \
  --name mcp-app \
  -p 80:3000 \
  --env-file .env \
  --restart unless-stopped \
  mcp-server
```

#### **2.3 Configure Security Groups**
- **Inbound Rules:**
  - HTTP (80) - 0.0.0.0/0
  - HTTPS (443) - 0.0.0.0/0 (if using SSL)
  - SSH (22) - Your IP only

#### **2.4 Set Up Domain & SSL (Optional)**
```bash
# Install Nginx
sudo apt install nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/mcp-server

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/mcp-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### **Step 3: Google Cloud Run Deployment**

#### **3.1 Install Google Cloud CLI**
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

#### **3.2 Build and Deploy**
```bash
# Set project
gcloud config set project your-project-id

# Build and push to Container Registry
docker build -t gcr.io/your-project-id/mcp-server .
docker push gcr.io/your-project-id/mcp-server

# Deploy to Cloud Run
gcloud run deploy mcp-server \
  --image gcr.io/your-project-id/mcp-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GITHUB_TOKEN=your_token,NOTION_API_KEY=your_key,NOTION_DATABASE_ID=your_database_id,GITHUB_WEBHOOK_SECRET=your_secret,NODE_ENV=production"
```

### **Step 4: Docker Compose for Production**

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - NOTION_API_KEY=${NOTION_API_KEY}
      - NOTION_DATABASE_ID=${NOTION_DATABASE_ID}
      - GITHUB_WEBHOOK_SECRET=${GITHUB_WEBHOOK_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

---

## **Option 2: Platform-as-a-Service (PaaS)**

### **Prerequisites**
- GitHub repository with your code
- PaaS account (Vercel, Railway, Heroku, etc.)

---

### **A. Vercel Deployment**

#### **Step 1: Prepare for Vercel**
Create `vercel.json` in your project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### **Step 2: Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add GITHUB_TOKEN
vercel env add NOTION_API_KEY
vercel env add NOTION_DATABASE_ID
vercel env add GITHUB_WEBHOOK_SECRET

# Deploy to production
vercel --prod
```

#### **Step 3: Configure GitHub Integration**
1. Go to Vercel Dashboard
2. Import your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm run build:prod`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

### **B. Railway Deployment**

#### **Step 1: Connect Repository**
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your MCP repository

#### **Step 2: Configure Environment**
In Railway dashboard, add environment variables:
```
GITHUB_TOKEN=your_production_github_token
NOTION_API_KEY=ntn_your_production_notion_key
NOTION_DATABASE_ID=your_production_database_id
GITHUB_WEBHOOK_SECRET=your_production_webhook_secret
NODE_ENV=production
```

#### **Step 3: Configure Build**
Railway will automatically detect your Node.js app. Ensure your `package.json` has:
```json
{
  "scripts": {
    "build": "npm run build:prod",
    "start": "node dist/index.js"
  }
}
```

---

### **C. Heroku Deployment**

#### **Step 1: Install Heroku CLI**
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login
```

#### **Step 2: Create Heroku App**
```bash
# Create app
heroku create your-mcp-app-name

# Set buildpacks
heroku buildpacks:set heroku/nodejs
```

#### **Step 3: Configure Environment**
```bash
# Set environment variables
heroku config:set GITHUB_TOKEN=your_production_github_token
heroku config:set NOTION_API_KEY=ntn_your_production_notion_key
heroku config:set NOTION_DATABASE_ID=your_production_database_id
heroku config:set GITHUB_WEBHOOK_SECRET=your_production_webhook_secret
heroku config:set NODE_ENV=production
```

#### **Step 4: Deploy**
```bash
# Deploy to Heroku
git push heroku main

# Open app
heroku open
```

---

## **Post-Deployment Verification**

### **Health Checks**
```bash
# Test health endpoint
curl https://your-app-domain.com/

# Test capability endpoints
curl https://your-app-domain.com/resources/github-capabilities
curl https://your-app-domain.com/resources/notion-capabilities

# Expected responses:
# - Health: "Hello World"
# - Capabilities: JSON with available tools
```

### **Webhook Testing**
```bash
# Test webhook endpoint (replace with your actual webhook secret)
curl -X POST https://your-app-domain.com/webhook/github \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=your_signature" \
  -d '{"test": "payload"}'
```

### **Monitoring**
```bash
# Docker logs
docker logs mcp-app

# Railway logs
railway logs

# Heroku logs
heroku logs --tail

# Vercel logs
vercel logs
```

---

## **Environment Variables Reference**

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes |
| `NOTION_API_KEY` | Notion API Key (starts with `ntn_`) | Yes |
| `NOTION_DATABASE_ID` | Notion Database ID | Yes |
| `GITHUB_WEBHOOK_SECRET` | GitHub Webhook Secret | Yes |
| `NODE_ENV` | Environment (production/development) | No |
| `PORT` | Server port (default: 3000) | No |

---

## **Troubleshooting**

### **Common Issues**

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :3000
   # Kill process
   kill -9 <PID>
   ```

2. **Environment Variables Missing**
   ```bash
   # Check environment variables
   node -e "console.log(process.env)"
   ```

3. **Docker Build Fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   # Rebuild
   docker build --no-cache -t mcp-server .
   ```

4. **Webhook Signature Invalid**
   - Verify webhook secret matches GitHub configuration
   - Check webhook URL is correct
   - Ensure HTTPS is used in production

### **Debug Commands**
```bash
# Test local build
npm run build:prod && npm start

# Test Docker build
docker build -t mcp-server . && docker run -p 3000:3000 mcp-server

# Check application status
curl -f http://localhost:3000/ || echo "App not responding"
```

---

## **Security Best Practices**

1. **Environment Variables**
   - Never commit `.env` files
   - Use different tokens for development/production
   - Rotate tokens regularly

2. **Network Security**
   - Use HTTPS in production
   - Configure firewall rules
   - Limit SSH access

3. **Application Security**
   - Validate webhook signatures
   - Implement rate limiting
   - Monitor application logs

4. **Docker Security**
   - Run containers as non-root user
   - Use specific image tags
   - Scan images for vulnerabilities

---

## **Cost Optimization**

### **AWS EC2**
- Use t3.micro for development
- Consider reserved instances for production
- Monitor usage with CloudWatch

### **Google Cloud Run**
- Pay only for actual usage
- Set maximum instances to control costs
- Use Cloud Run Jobs for batch processing

### **PaaS Services**
- Vercel: Free tier available
- Railway: Pay-as-you-go pricing
- Heroku: Free tier discontinued, paid plans only

---

**Your MCP server is now ready for production deployment! Choose the strategy that best fits your needs and budget.** 🚀 