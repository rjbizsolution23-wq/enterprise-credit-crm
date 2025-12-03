/**
 * DisputeFox API Integration
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class DisputeFoxClient {
  private api: AxiosInstance
  private email: string
  private password: string
  private loginUrl: string

  constructor() {
    this.email = process.env.DISPUTEFOX_EMAIL || ''
    this.password = process.env.DISPUTEFOX_PASSWORD || ''
    this.loginUrl = process.env.DISPUTEFOX_LOGIN_URL || 'https://pulse.disputeprocess.com/jsp/client/login.jsp'

    this.api = axios.create({
      baseURL: 'https://pulse.disputeprocess.com',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Login to DisputeFox
   */
  async login(): Promise<string> {
    try {
      const response = await this.api.post('/api/auth/login', {
        email: this.email,
        password: this.password,
      })

      const token = response.data.token
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return token
    } catch (error: any) {
      throw new Error(`DisputeFox login error: ${error.message}`)
    }
  }

  /**
   * Submit dispute
   */
  async submitDispute(disputeData: any): Promise<any> {
    try {
      const response = await this.api.post('/api/disputes', disputeData)
      return response.data
    } catch (error: any) {
      throw new Error(`DisputeFox submit error: ${error.message}`)
    }
  }

  /**
   * Get dispute status
   */
  async getDisputeStatus(disputeId: string): Promise<any> {
    try {
      const response = await this.api.get(`/api/disputes/${disputeId}`)
      return response.data
    } catch (error: any) {
      throw new Error(`DisputeFox status error: ${error.message}`)
    }
  }
}
