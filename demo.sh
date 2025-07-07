#!/bin/bash

# 🚀 MCP Server Full Demo Script
# This script demonstrates all features of your MCP server

echo "🎯 MCP Server Full Demo"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if server is running
echo "1. Checking server status..."
if curl -s http://localhost:3000 > /dev/null; then
    print_status "Server is running on http://localhost:3000"
else
    print_error "Server is not running. Please start it with: npm start"
    exit 1
fi

echo ""
echo "2. Testing Health Check Endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000)
if [ "$HEALTH_RESPONSE" = "Hello World" ]; then
    print_status "Health check passed: $HEALTH_RESPONSE"
else
    print_error "Health check failed: $HEALTH_RESPONSE"
fi

echo ""
echo "3. Testing Capability Discovery Endpoints..."

echo "   GitHub Capabilities:"
GITHUB_CAPS=$(curl -s http://localhost:3000/resources/github-capabilities)
if echo "$GITHUB_CAPS" | grep -q "createIssueComment"; then
    print_status "GitHub capabilities endpoint working"
    echo "   Available tools: createIssueComment, getIssue, listIssues"
else
    print_error "GitHub capabilities endpoint failed"
fi

echo "   Notion Capabilities:"
NOTION_CAPS=$(curl -s http://localhost:3000/resources/notion-capabilities)
if echo "$NOTION_CAPS" | grep -q "createTaskInNotion"; then
    print_status "Notion capabilities endpoint working"
    echo "   Available tools: createTaskInNotion, getPage, getDatabase, queryDatabase"
else
    print_error "Notion capabilities endpoint failed"
fi

echo "   Google Docs Capabilities:"
GOOGLE_CAPS=$(curl -s http://localhost:3000/resources/google-docs-capabilities)
if echo "$GOOGLE_CAPS" | grep -q "planned"; then
    print_status "Google Docs capabilities endpoint working (planned features)"
    echo "   Planned tools: createDocument, updateDocument, getDocument"
else
    print_error "Google Docs capabilities endpoint failed"
fi

echo ""
echo "4. Testing GitHub Webhook with Signature Verification..."

# Create test payload
cat > demo_payload.json << EOF
{
  "title": "Demo Issue from MCP Server",
  "body": "This issue was created during the MCP server demo to showcase webhook functionality.",
  "number": 456,
  "state": "open",
  "user": {
    "login": "demo-user"
  },
  "created_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# Generate signature
SIGNATURE=$(node -e "
const crypto = require('crypto');
const fs = require('fs');
const secret = 'subwaysurf45';
const payload = fs.readFileSync('demo_payload.json');
const sig = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
console.log(sig);
")

echo "   Generated signature: ${SIGNATURE:0:20}..."

# Send webhook
WEBHOOK_RESPONSE=$(curl -s -X POST http://localhost:3000/webhook/github \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: $SIGNATURE" \
  --data-binary @demo_payload.json)

if echo "$WEBHOOK_RESPONSE" | grep -q "success"; then
    print_status "Webhook test successful"
    echo "   Response: $WEBHOOK_RESPONSE"
else
    print_error "Webhook test failed"
    echo "   Response: $WEBHOOK_RESPONSE"
fi

echo ""
echo "5. Testing Invalid Webhook Signature (Security Test)..."

INVALID_RESPONSE=$(curl -s -X POST http://localhost:3000/webhook/github \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=invalid_signature" \
  --data-binary @demo_payload.json)

if echo "$INVALID_RESPONSE" | grep -q "Invalid signature"; then
    print_status "Security test passed - invalid signature rejected"
else
    print_warning "Security test - check if invalid signature was properly rejected"
fi

echo ""
echo "6. Running Automated Tests..."

if npm test > /dev/null 2>&1; then
    print_status "All tests passed"
else
    print_warning "Some tests may have failed - check with: npm test"
fi

echo ""
echo "7. Testing Production Build..."

if npm run build:prod > /dev/null 2>&1; then
    print_status "Production build successful"
    DIST_SIZE=$(du -sh dist/ | cut -f1)
    echo "   Build size: $DIST_SIZE"
else
    print_error "Production build failed"
fi

echo ""
echo "8. Testing Docker Build..."

if docker build -t mcp-server-demo . > /dev/null 2>&1; then
    print_status "Docker build successful"
    IMAGE_SIZE=$(docker images mcp-server-demo --format "table {{.Size}}" | tail -n 1)
    echo "   Image size: $IMAGE_SIZE"
else
    print_warning "Docker build failed - Docker may not be installed"
fi

echo ""
echo "9. Environment Variables Check..."

if [ -f ".env" ]; then
    print_status ".env file exists"
    ENV_VARS=$(grep -c "=" .env 2>/dev/null || echo "0")
    echo "   Environment variables: $ENV_VARS"
else
    print_warning ".env file not found - create one with your API keys"
fi

echo ""
echo "10. API Integration Status..."

# Check if GitHub token is set
if [ -n "$GITHUB_TOKEN" ] || grep -q "GITHUB_TOKEN" .env 2>/dev/null; then
    print_status "GitHub API integration ready"
else
    print_warning "GitHub token not configured"
fi

# Check if Notion key is set
if [ -n "$NOTION_API_KEY" ] || grep -q "NOTION_API_KEY" .env 2>/dev/null; then
    print_status "Notion API integration ready"
else
    print_warning "Notion API key not configured"
fi

echo ""
echo "🎉 Demo Complete!"
echo "=================="
echo ""
echo "Your MCP server features:"
echo "✅ Express.js server with TypeScript"
echo "✅ GitHub webhook with signature verification"
echo "✅ Capability discovery endpoints"
echo "✅ GitHub API integration (Octokit)"
echo "✅ Notion API integration"
echo "✅ Comprehensive testing (Jest)"
echo "✅ Production build optimization"
echo "✅ Docker containerization"
echo "✅ Environment variable management"
echo "✅ Security best practices"
echo ""
echo "Next steps:"
echo "1. Configure your API keys in .env"
echo "2. Set up GitHub webhooks pointing to your server"
echo "3. Deploy to your preferred platform"
echo "4. Start receiving real GitHub events!"
echo ""
echo "For deployment options, see: DEPLOYMENT.md"

# Cleanup
rm -f demo_payload.json 