/**
 * ConvertKit Integration
 * Email automation and sequences
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class ConvertKitService {
  private api: AxiosInstance
  private apiKey: string
  private apiSecret: string

  constructor() {
    this.apiKey = process.env.CONVERTKIT_API_KEY || ''
    this.apiSecret = process.env.CONVERTKIT_API_SECRET || ''

    this.api = axios.create({
      baseURL: 'https://api.convertkit.com/v3',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Add subscriber
   */
  async addSubscriber(email: string, tags?: string[]): Promise<any> {
    try {
      const response = await this.api.post('/subscribers', {
        api_key: this.apiKey,
        email,
        tags,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`ConvertKit add subscriber error: ${error.message}`)
    }
  }

  /**
   * Add subscriber to form
   */
  async subscribeToForm(formId: string, email: string, firstName?: string): Promise<any> {
    try {
      const response = await this.api.post(`/forms/${formId}/subscribe`, {
        api_key: this.apiKey,
        email,
        first_name: firstName,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`ConvertKit form subscribe error: ${error.message}`)
    }
  }
}
