import 'dotenv/config';
import express, { Request, Response } from 'express';
import { handleGitHubIssue } from './workflow';
import crypto from 'crypto';

const app = express();
const PORT: number = 3000;

// Middleware to parse JSON payloads
app.use(express.json({ verify: (req: any, res, buf) => { req.rawBody = buf; } }));

function verifyGitHubSignature(req: Request): boolean {
  const signature = req.headers['x-hub-signature-256'] as string;
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!signature || !secret) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update((req as any).rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// GitHub capabilities discovery endpoint
app.get('/resources/github-capabilities', (req: Request, res: Response) => {
  res.json({
    service: 'GitHub',
    description: 'GitHub API integration for issue management and repository operations',
    tools: [
      {
        name: 'createIssueComment',
        description: 'Creates a comment on a GitHub issue',
        parameters: ['owner', 'repo', 'issue_number', 'body'],
        parameterTypes: {
          owner: 'string',
          repo: 'string', 
          issue_number: 'number',
          body: 'string'
        }
      },
      {
        name: 'getIssue',
        description: 'Retrieves details of a specific GitHub issue',
        parameters: ['owner', 'repo', 'issue_number'],
        parameterTypes: {
          owner: 'string',
          repo: 'string',
          issue_number: 'number'
        }
      },
      {
        name: 'listIssues',
        description: 'Lists issues in a repository with optional filtering',
        parameters: ['owner', 'repo', 'state', 'per_page'],
        parameterTypes: {
          owner: 'string',
          repo: 'string',
          state: 'string (open|closed|all)',
          per_page: 'number (max 100)'
        }
      }
    ]
  });
});

// Notion capabilities discovery endpoint
app.get('/resources/notion-capabilities', (req: Request, res: Response) => {
  res.json({
    service: 'Notion',
    description: 'Notion API integration for database operations and task management',
    tools: [
      {
        name: 'createTaskInNotion',
        description: 'Creates a new task/page in a Notion database',
        parameters: ['title', 'content'],
        parameterTypes: {
          title: 'string',
          content: 'string'
        }
      },
      {
        name: 'getPage',
        description: 'Retrieves details of a specific Notion page',
        parameters: ['pageId'],
        parameterTypes: {
          pageId: 'string'
        }
      },
      {
        name: 'getDatabase',
        description: 'Retrieves the structure and properties of the configured Notion database',
        parameters: [],
        parameterTypes: {}
      },
      {
        name: 'queryDatabase',
        description: 'Queries the Notion database with optional filters and sorting',
        parameters: ['filter', 'sorts'],
        parameterTypes: {
          filter: 'object (optional)',
          sorts: 'array (optional)'
        }
      }
    ]
  });
});

// Google Docs capabilities discovery endpoint
app.get('/resources/google-docs-capabilities', (req: Request, res: Response) => {
  res.json({
    service: 'Google Docs',
    description: 'Google Docs API integration for document operations (placeholder for future implementation)',
    tools: [
      {
        name: 'createDocument',
        description: 'Creates a new Google Doc (not yet implemented)',
        parameters: ['title', 'content'],
        parameterTypes: {
          title: 'string',
          content: 'string'
        },
        status: 'planned'
      },
      {
        name: 'updateDocument',
        description: 'Updates content in an existing Google Doc (not yet implemented)',
        parameters: ['documentId', 'content'],
        parameterTypes: {
          documentId: 'string',
          content: 'string'
        },
        status: 'planned'
      },
      {
        name: 'getDocument',
        description: 'Retrieves content from a Google Doc (not yet implemented)',
        parameters: ['documentId'],
        parameterTypes: {
          documentId: 'string'
        },
        status: 'planned'
      }
    ],
    note: 'Google Docs integration is planned for future implementation'
  });
});

// GitHub webhook endpoint
app.post('/webhook/github', (req: Request, res: Response) => {
  if (!verifyGitHubSignature(req)) {
    return res.status(401).json({ status: 'error', message: 'Invalid signature' });
  }
  try {
    console.log('=== GitHub Webhook Received ===');
    console.log('Headers:', req.headers);
    console.log('Payload:', JSON.stringify(req.body, null, 2));
    
    // Check if the payload contains issue data
    if (req.body && req.body.issue) {
      handleGitHubIssue(req.body.issue);
    } else if (req.body && req.body.title && req.body.body) {
      // Direct issue payload
      handleGitHubIssue(req.body);
    } else {
      console.log('No issue data found in webhook payload');
    }
    
    // Respond with success
    res.status(200).json({ 
      status: 'success', 
      message: 'Webhook received and processed' 
    });
    
  } catch (error) {
    console.error('Error processing GitHub webhook:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error processing webhook' 
    });
  }
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: Function) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    status: 'error', 
    message: 'Internal server error' 
  });
});

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Route not found' 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 