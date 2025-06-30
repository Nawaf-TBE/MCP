# MCP (Model Context Protocol) Server

A Node.js/TypeScript server that implements the Model Context Protocol with integrations for GitHub and Notion.

## 🚀 Features

- **Express.js Server** with TypeScript support
- **GitHub Integration** using Octokit REST API
- **Notion Integration** for task management
- **Docker Support** for containerized deployment
- **Webhook Endpoints** for GitHub event handling

## 📋 Prerequisites

- Node.js 18+
- Docker (optional)
- GitHub Personal Access Token
- Notion API Key and Database ID

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd MCP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# GitHub Personal Access Token
GITHUB_TOKEN=your_github_token_here

# Notion API Key
NOTION_API_KEY=your_notion_api_key_here

# Notion Database ID
NOTION_DATABASE_ID=your_database_id_here

# Node environment
NODE_ENV=development
```

### API Keys Setup

1. **GitHub Token**: 
   - Go to https://github.com/settings/tokens
   - Create a new token with `repo` scope

2. **Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Create a new integration
   - Share your database with the integration

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Docker
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d
```

## 📡 API Endpoints

- **GET `/`** - Health check endpoint
- **POST `/webhook/github`** - GitHub webhook handler

## 🛠️ Available Tools

### GitHub Tools (`src/tools/github.ts`)
- `createIssueComment()` - Post comments on GitHub issues
- `getIssue()` - Get issue details
- `listIssues()` - List repository issues

### Notion Tools (`src/tools/notion.ts`)
- `createTaskInNotion()` - Create tasks in Notion database
- `getPage()` - Get page details
- `getDatabase()` - Get database structure
- `queryDatabase()` - Query database

## 🧪 Testing

Test the webhook endpoint:
```bash
curl -X POST http://localhost:3000/webhook/github \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Issue",
    "body": "This is a test issue",
    "number": 123
  }'
```

## 📁 Project Structure

```
MCP/
├── src/
│   ├── tools/
│   │   ├── github.ts      # GitHub API integration
│   │   └── notion.ts      # Notion API integration
│   ├── index.ts           # Main server file
│   └── workflow.ts        # GitHub issue handling
├── dist/                  # Compiled JavaScript
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Notion API](https://developers.notion.com/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/) 