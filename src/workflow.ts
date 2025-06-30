// GitHub issue payload interface
interface GitHubIssuePayload {
  title: string;
  body: string;
  number?: number;
  state?: string;
  user?: {
    login: string;
  };
  created_at?: string;
  updated_at?: string;
}

/**
 * Handles a GitHub issue payload
 * @param payload - The GitHub issue payload object
 */
export function handleGitHubIssue(payload: GitHubIssuePayload): void {
  console.log('=== GitHub Issue Received ===');
  console.log(`Title: ${payload.title}`);
  console.log(`Body: ${payload.body}`);
  
  if (payload.number) {
    console.log(`Issue #: ${payload.number}`);
  }
  
  if (payload.state) {
    console.log(`State: ${payload.state}`);
  }
  
  if (payload.user) {
    console.log(`Created by: ${payload.user.login}`);
  }
  
  if (payload.created_at) {
    console.log(`Created at: ${payload.created_at}`);
  }
  
  console.log('============================');
} 