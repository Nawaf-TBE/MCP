# 🚀 Deployment Guide

## **Production Build Process**

### **1. Build for Production**
```bash
# Clean and build optimized production code
npm run build:prod

# Or use regular build (includes source maps and declarations)
npm run build
```

### **2. Environment Setup**
Ensure your `.env` file contains all required production variables:
```env
# GitHub Configuration
GITHUB_TOKEN=your_production_github_token
GITHUB_WEBHOOK_SECRET=your_production_webhook_secret

# Notion Configuration
NOTION_API_KEY=ntn_your_production_notion_key
NOTION_DATABASE_ID=your_production_database_id

# Environment
NODE_ENV=production
PORT=3000
```

### **3. Start Production Server**
```bash
# Start with production environment
npm run start:prod

# Or use regular start
npm start
```

## **Docker Deployment**

### **Build Docker Image**
```bash
docker build -t mcp-server .
```

### **Run with Docker Compose**
```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up -d
```

### **Environment Variables in Docker**
```bash
# Set environment variables
export GITHUB_TOKEN=your_token
export NOTION_API_KEY=your_key
export NOTION_DATABASE_ID=your_database_id
export GITHUB_WEBHOOK_SECRET=your_secret

# Run container
docker run -p 3000:3000 \
  -e GITHUB_TOKEN \
  -e NOTION_API_KEY \
  -e NOTION_DATABASE_ID \
  -e GITHUB_WEBHOOK_SECRET \
  -e NODE_ENV=production \
  mcp-server
```

## **Cloud Deployment Options**

### **Heroku**
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set GITHUB_TOKEN=your_token
heroku config:set NOTION_API_KEY=your_key
heroku config:set NOTION_DATABASE_ID=your_database_id
heroku config:set GITHUB_WEBHOOK_SECRET=your_secret
git push heroku main
```

### **Railway**
```bash
# Install Railway CLI
railway login
railway init
railway up
```

### **Vercel**
```bash
# Install Vercel CLI
vercel
vercel --prod
```

## **Health Checks**

### **Verify Deployment**
```bash
# Health check
curl http://your-domain.com/

# GitHub capabilities
curl http://your-domain.com/resources/github-capabilities

# Notion capabilities
curl http://your-domain.com/resources/notion-capabilities
```

## **Monitoring & Logs**

### **Application Logs**
```bash
# View logs
docker logs mcp-app-1

# Follow logs
docker logs -f mcp-app-1
```

### **Health Monitoring**
- **Endpoint**: `GET /`
- **Expected Response**: `"Hello World"`
- **Status**: 200 OK

## **Security Checklist**

- [ ] Environment variables are set
- [ ] GitHub webhook secret is configured
- [ ] API keys have appropriate scopes
- [ ] Database permissions are correct
- [ ] HTTPS is enabled (if applicable)
- [ ] Firewall rules are configured
- [ ] Rate limiting is implemented (if needed)

## **Troubleshooting**

### **Common Issues**
1. **Port already in use**: Kill existing process or change port
2. **Environment variables missing**: Check `.env` file
3. **API authentication failed**: Verify API keys and scopes
4. **Webhook signature invalid**: Check webhook secret

### **Debug Commands**
```bash
# Check if server is running
lsof -i :3000

# Test webhook endpoint
curl -X POST http://localhost:3000/webhook/github \
  -H "Content-Type: application/json" \
  -d '{"test": "payload"}'

# View environment variables
node -e "console.log(process.env)"
``` 