/**
 * Apify Integration
 * Web scraping and automation
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class ApifyService {
  private api: AxiosInstance
  private token: string

  constructor() {
    this.token = process.env.APIFY_API_KEY || ''
    if (!this.token) {
      throw new Error('Apify API key not configured')
    }

    this.api = axios.create({
      baseURL: 'https://api.apify.com/v2',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Run actor
   */
  async runActor(actorId: string, input: any): Promise<any> {
    try {
      const response = await this.api.post(`/acts/${actorId}/runs`, { input })
      return response.data
    } catch (error: any) {
      throw new Error(`Apify run actor error: ${error.message}`)
    }
  }

  /**
   * Get dataset items
   */
  async getDatasetItems(datasetId: string): Promise<any[]> {
    try {
      const response = await this.api.get(`/datasets/${datasetId}/items`)
      return response.data.items || []
    } catch (error: any) {
      throw new Error(`Apify get dataset items error: ${error.message}`)
    }
  }

  /**
   * Get run status
   */
  async getRunStatus(runId: string): Promise<any> {
    try {
      const response = await this.api.get(`/actor-runs/${runId}`)
      return response.data
    } catch (error: any) {
      throw new Error(`Apify get run status error: ${error.message}`)
    }
  }
}
