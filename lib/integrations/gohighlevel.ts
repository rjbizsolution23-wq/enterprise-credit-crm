/**
 * GoHighLevel CRM Integration
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class GoHighLevelClient {
  private api: AxiosInstance
  private apiKey: string

  constructor() {
    this.apiKey = process.env.GOHIGHLEVEL_API_KEY || ''

    this.api = axios.create({
      baseURL: 'https://services.leadconnectorhq.com',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Create contact
   */
  async createContact(data: {
    locationId: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    customFields?: Record<string, any>
  }): Promise<any> {
    try {
      const response = await this.api.post(
        `/locations/${data.locationId}/contacts`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          customFields: data.customFields,
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`GoHighLevel create contact error: ${error.message}`)
    }
  }

  /**
   * Update contact
   */
  async updateContact(locationId: string, contactId: string, data: any): Promise<any> {
    try {
      const response = await this.api.put(
        `/locations/${locationId}/contacts/${contactId}`,
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`GoHighLevel update contact error: ${error.message}`)
    }
  }

  /**
   * Create opportunity
   */
  async createOpportunity(data: {
    locationId: string
    contactId: string
    pipelineId: string
    stageId: string
    title: string
    value?: number
  }): Promise<any> {
    try {
      const response = await this.api.post(
        `/opportunities`,
        {
          locationId: data.locationId,
          contactId: data.contactId,
          pipelineId: data.pipelineId,
          stageId: data.stageId,
          title: data.title,
          monetaryValue: data.value,
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`GoHighLevel create opportunity error: ${error.message}`)
    }
  }
}
