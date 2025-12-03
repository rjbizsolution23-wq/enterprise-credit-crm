/**
 * Apify Integration
 * Web scraping and automation
 * RJ Business Solutions - Rick Jefferson
 */

// Apify integration - using direct API calls
// Note: apify-client package has version issues, using axios directly

export class ApifyService {
  private client: ApifyApi

  constructor() {
    const token = process.env.APIFY_API_KEY
    if (!token) {
      throw new Error('Apify API key not configured')
    }

    this.client = new ApifyApi({ token })
  }

  /**
   * Run actor
   */
  async runActor(actorId: string, input: any): Promise<any> {
    try {
      const run = await this.client.actor(actorId).call(input)
      return run
    } catch (error: any) {
      throw new Error(`Apify run actor error: ${error.message}`)
    }
  }

  /**
   * Get dataset items
   */
  async getDatasetItems(datasetId: string): Promise<any[]> {
    try {
      const { items } = await this.client.dataset(datasetId).listItems()
      return items
    } catch (error: any) {
      throw new Error(`Apify get dataset items error: ${error.message}`)
    }
  }
}
