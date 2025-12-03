/**
 * Mailchimp Integration
 * Email marketing campaigns
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class MailchimpService {
  private api: AxiosInstance
  private apiKey: string
  private serverPrefix: string

  constructor() {
    this.apiKey = process.env.MAILCHIMP_API_KEY || ''
    this.serverPrefix = this.apiKey.split('-')[1] || 'us1'

    this.api = axios.create({
      baseURL: `https://${this.serverPrefix}.api.mailchimp.com/3.0`,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Add subscriber to list
   */
  async addSubscriber(listId: string, email: string, mergeFields?: any): Promise<any> {
    try {
      const response = await this.api.post(`/lists/${listId}/members`, {
        email_address: email,
        status: 'subscribed',
        merge_fields: mergeFields,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Mailchimp add subscriber error: ${error.message}`)
    }
  }

  /**
   * Create campaign
   */
  async createCampaign(data: {
    listId: string
    subject: string
    htmlContent: string
    fromName: string
    fromEmail: string
  }): Promise<any> {
    try {
      // Create campaign
      const campaignResponse = await this.api.post('/campaigns', {
        type: 'regular',
        recipients: {
          list_id: data.listId,
        },
        settings: {
          subject_line: data.subject,
          from_name: data.fromName,
          reply_to: data.fromEmail,
        },
      })

      const campaignId = campaignResponse.data.id

      // Set content
      await this.api.put(`/campaigns/${campaignId}/content`, {
        html: data.htmlContent,
      })

      return campaignResponse.data
    } catch (error: any) {
      throw new Error(`Mailchimp create campaign error: ${error.message}`)
    }
  }
}
