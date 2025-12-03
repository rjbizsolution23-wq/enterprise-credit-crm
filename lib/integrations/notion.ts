/**
 * Notion Integration
 * Knowledge base and documentation
 * RJ Business Solutions - Rick Jefferson
 */

import { Client } from '@notionhq/client'

export class NotionService {
  private client: Client

  constructor() {
    const apiKey = process.env.NOTION_API_KEY
    if (!apiKey) {
      throw new Error('Notion API key not configured')
    }

    this.client = new Client({ auth: apiKey })
  }

  /**
   * Create page in Notion
   */
  async createPage(databaseId: string, properties: any): Promise<any> {
    try {
      const response = await this.client.pages.create({
        parent: { database_id: databaseId },
        properties,
      })
      return response
    } catch (error: any) {
      throw new Error(`Notion create page error: ${error.message}`)
    }
  }

  /**
   * Update page
   */
  async updatePage(pageId: string, properties: any): Promise<any> {
    try {
      const response = await this.client.pages.update({
        page_id: pageId,
        properties,
      })
      return response
    } catch (error: any) {
      throw new Error(`Notion update page error: ${error.message}`)
    }
  }

  /**
   * Query database
   */
  async queryDatabase(databaseId: string, filter?: any): Promise<any> {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter,
      })
      return response
    } catch (error: any) {
      throw new Error(`Notion query database error: ${error.message}`)
    }
  }
}

