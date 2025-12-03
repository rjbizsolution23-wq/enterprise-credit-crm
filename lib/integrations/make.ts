/**
 * Make.com (Integromat) Integration
 * RJ Business Solutions - Rick Jefferson
 */

import axios from 'axios'

export class MakeIntegration {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.MAKE_API_KEY || ''
    this.baseUrl = 'https://hook.eu1.make.com'
  }

  /**
   * Trigger Make.com scenario
   */
  async triggerScenario(scenarioId: string, data: any): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${scenarioId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: any) {
      throw new Error(`Make.com trigger error: ${error.message}`)
    }
  }

  /**
   * Trigger webhook
   */
  async triggerWebhook(webhookUrl: string, data: any): Promise<void> {
    try {
      await axios.post(webhookUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: any) {
      throw new Error(`Make.com webhook error: ${error.message}`)
    }
  }
}
