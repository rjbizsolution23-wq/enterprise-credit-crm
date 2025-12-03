/**
 * Calendly Integration
 * Appointment scheduling
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class CalendlyService {
  private api: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = process.env.CALENDLY_ACCESS_TOKEN || ''

    this.api = axios.create({
      baseURL: 'https://api.calendly.com',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Create event
   */
  async createEvent(data: {
    name: string
    duration: number
    location?: string
    description?: string
  }): Promise<any> {
    try {
      const response = await this.api.post('/scheduled_events', {
        name: data.name,
        start_time: new Date().toISOString(),
        duration: data.duration,
        location: data.location,
        description: data.description,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Calendly create event error: ${error.message}`)
    }
  }

  /**
   * Get user's events
   */
  async getUserEvents(userUri: string): Promise<any> {
    try {
      const response = await this.api.get('/scheduled_events', {
        params: { user: userUri },
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Calendly get events error: ${error.message}`)
    }
  }
}
