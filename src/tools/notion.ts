import { Client } from '@notionhq/client';

// Initialize Notion client with API key
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Validates that the Notion client is properly configured
 * @throws Error if API key or database ID is missing
 */
function validateNotionConfig(): void {
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY environment variable is not set');
  }
  
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error('NOTION_DATABASE_ID environment variable is not set');
  }
}

/**
 * Creates a new task/page in a Notion database
 * @param title - The title of the task
 * @param content - The content/description of the task
 * @returns Promise with the created page data
 */
export async function createTaskInNotion(
  title: string,
  content: string
): Promise<any> {
  try {
    // Validate configuration
    validateNotionConfig();
    
    // Validate input parameters
    if (!title || !content) {
      throw new Error('Title and content are required parameters');
    }

    console.log(`Creating task in Notion: "${title}"`);

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID!,
      },
      properties: {
        // Assuming the database has a "Title" property
        // You may need to adjust this based on your actual database schema
        'Title': {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ],
    });

    console.log(`Task created successfully. Page ID: ${response.id}`);
    return response;

  } catch (error) {
    console.error('Error creating task in Notion:', error);
    throw error;
  }
}

/**
 * Gets a page from Notion by ID
 * @param pageId - The Notion page ID
 * @returns Promise with the page data
 */
export async function getPage(pageId: string): Promise<any> {
  try {
    validateNotionConfig();
    
    if (!pageId) {
      throw new Error('Page ID is required');
    }

    const response = await notion.pages.retrieve({
      page_id: pageId,
    });

    return response;

  } catch (error) {
    console.error('Error getting page from Notion:', error);
    throw error;
  }
}

/**
 * Gets the database structure
 * @returns Promise with the database data
 */
export async function getDatabase(): Promise<any> {
  try {
    validateNotionConfig();

    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    return response;

  } catch (error) {
    console.error('Error getting database from Notion:', error);
    throw error;
  }
}

/**
 * Queries the database for pages
 * @param filter - Optional filter object
 * @param sorts - Optional sort objects
 * @returns Promise with the query results
 */
export async function queryDatabase(
  filter?: any,
  sorts?: any[]
): Promise<any> {
  try {
    validateNotionConfig();

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter,
      sorts,
    });

    return response;

  } catch (error) {
    console.error('Error querying database:', error);
    throw error;
  }
} 