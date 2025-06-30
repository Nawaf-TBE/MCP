import { Octokit } from '@octokit/rest';

// Initialize Octokit client with Personal Access Token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Creates a comment on a GitHub issue
 * @param owner - Repository owner (username or organization)
 * @param repo - Repository name
 * @param issue_number - Issue number
 * @param body - Comment body text
 * @returns Promise with the created comment data
 */
export async function createIssueComment(
  owner: string,
  repo: string,
  issue_number: number,
  body: string
): Promise<any> {
  try {
    // Validate required parameters
    if (!owner || !repo || !issue_number || !body) {
      throw new Error('Missing required parameters: owner, repo, issue_number, and body are required');
    }

    // Validate GitHub token
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    console.log(`Creating comment on issue #${issue_number} in ${owner}/${repo}`);

    const response = await octokit.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });

    console.log(`Comment created successfully. Comment ID: ${response.data.id}`);
    return response.data;

  } catch (error) {
    console.error('Error creating issue comment:', error);
    throw error;
  }
}

/**
 * Gets an issue by number
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param issue_number - Issue number
 * @returns Promise with the issue data
 */
export async function getIssue(
  owner: string,
  repo: string,
  issue_number: number
): Promise<any> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    const response = await octokit.issues.get({
      owner,
      repo,
      issue_number,
    });

    return response.data;

  } catch (error) {
    console.error('Error getting issue:', error);
    throw error;
  }
}

/**
 * Lists issues for a repository
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param state - Issue state (open, closed, all)
 * @param per_page - Number of issues per page (max 100)
 * @returns Promise with the issues data
 */
export async function listIssues(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
  per_page: number = 30
): Promise<any[]> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    const response = await octokit.issues.listForRepo({
      owner,
      repo,
      state,
      per_page,
    });

    return response.data;

  } catch (error) {
    console.error('Error listing issues:', error);
    throw error;
  }
} 