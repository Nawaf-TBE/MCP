import { handleGitHubIssue } from '../workflow';

// Mock the external modules
jest.mock('../tools/github', () => ({
  createIssueComment: jest.fn(),
  getIssue: jest.fn(),
  listIssues: jest.fn(),
}));

jest.mock('../tools/notion', () => ({
  createTaskInNotion: jest.fn(),
  getPage: jest.fn(),
  getDatabase: jest.fn(),
  queryDatabase: jest.fn(),
}));

// Import the mocked functions
import { createIssueComment, getIssue, listIssues } from '../tools/github';
import { createTaskInNotion, getPage, getDatabase, queryDatabase } from '../tools/notion';

// Type the mocked functions
const mockCreateIssueComment = createIssueComment as jest.MockedFunction<typeof createIssueComment>;
const mockGetIssue = getIssue as jest.MockedFunction<typeof getIssue>;
const mockListIssues = listIssues as jest.MockedFunction<typeof listIssues>;
const mockCreateTaskInNotion = createTaskInNotion as jest.MockedFunction<typeof createTaskInNotion>;
const mockGetPage = getPage as jest.MockedFunction<typeof getPage>;
const mockGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;
const mockQueryDatabase = queryDatabase as jest.MockedFunction<typeof queryDatabase>;

describe('workflow.ts', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.log after each test
    jest.restoreAllMocks();
  });

  describe('handleGitHubIssue', () => {
    it('should log issue details correctly', () => {
      // Sample GitHub issue payload
      const sampleIssue = {
        title: 'Bug: Login not working',
        body: 'Users cannot log in with valid credentials',
        number: 123,
        state: 'open',
        user: {
          login: 'john_doe'
        },
        created_at: '2024-01-15T10:30:00Z'
      };

      // Call the function
      handleGitHubIssue(sampleIssue);

      // Verify that console.log was called with the expected messages
      expect(console.log).toHaveBeenCalledWith('=== GitHub Issue Received ===');
      expect(console.log).toHaveBeenCalledWith('Title: Bug: Login not working');
      expect(console.log).toHaveBeenCalledWith('Body: Users cannot log in with valid credentials');
      expect(console.log).toHaveBeenCalledWith('Issue #: 123');
      expect(console.log).toHaveBeenCalledWith('State: open');
      expect(console.log).toHaveBeenCalledWith('Created by: john_doe');
      expect(console.log).toHaveBeenCalledWith('Created at: 2024-01-15T10:30:00Z');
      expect(console.log).toHaveBeenCalledWith('============================');
    });

    it('should handle issue payload with minimal required fields', () => {
      const minimalIssue = {
        title: 'Simple issue',
        body: 'Simple description'
      };

      handleGitHubIssue(minimalIssue);

      // Should only log title and body
      expect(console.log).toHaveBeenCalledWith('Title: Simple issue');
      expect(console.log).toHaveBeenCalledWith('Body: Simple description');
      
      // Should not log optional fields
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Issue #:'));
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('State:'));
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Created by:'));
      expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Created at:'));
    });

    it('should handle issue payload with all optional fields', () => {
      const completeIssue = {
        title: 'Complete issue',
        body: 'Complete description',
        number: 456,
        state: 'closed',
        user: {
          login: 'jane_smith'
        },
        created_at: '2024-01-20T15:45:00Z',
        updated_at: '2024-01-21T09:15:00Z'
      };

      handleGitHubIssue(completeIssue);

      // Verify all fields are logged
      expect(console.log).toHaveBeenCalledWith('Title: Complete issue');
      expect(console.log).toHaveBeenCalledWith('Body: Complete description');
      expect(console.log).toHaveBeenCalledWith('Issue #: 456');
      expect(console.log).toHaveBeenCalledWith('State: closed');
      expect(console.log).toHaveBeenCalledWith('Created by: jane_smith');
      expect(console.log).toHaveBeenCalledWith('Created at: 2024-01-20T15:45:00Z');
    });

    it('should not throw error with empty or null values', () => {
      const issueWithEmptyValues = {
        title: '',
        body: '',
        number: 0,
        state: '',
        user: {
          login: ''
        },
        created_at: ''
      };

      // Should not throw an error
      expect(() => handleGitHubIssue(issueWithEmptyValues)).not.toThrow();
    });
  });

  describe('Integration with mocked tools', () => {
    it('should demonstrate how to test integration with GitHub tools', async () => {
      // Mock the GitHub function to return a successful response
      mockCreateIssueComment.mockResolvedValue({
        id: 12345,
        body: 'Test comment',
        user: { login: 'test-user' }
      });

      // This test demonstrates how you could test integration
      // In a real scenario, you might call handleGitHubIssue and then
      // verify that the appropriate GitHub/Notion functions were called
      
      const issue = {
        title: 'Test issue',
        body: 'Test body',
        number: 789
      };

      // Call the workflow function
      handleGitHubIssue(issue);

      // In a real integration test, you might verify that:
      // 1. The issue was processed correctly
      // 2. A comment was posted to GitHub
      // 3. A task was created in Notion
      
      // For now, we just verify the function doesn't throw
      expect(() => handleGitHubIssue(issue)).not.toThrow();
    });
  });
}); 