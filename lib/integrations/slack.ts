/**
 * Slack Integration
 * Team notifications and alerts
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class SlackService {
  private api: AxiosInstance
  private webhookUrl?: string
  private botToken?: string

  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL
    this.botToken = process.env.SLACK_BOT_TOKEN

    if (this.botToken) {
      this.api = axios.create({
        baseURL: 'https://slack.com/api',
        headers: {
          'Authorization': `Bearer ${this.botToken}`,
          'Content-Type': 'application/json',
        },
      })
    }
  }

  /**
   * Send message via webhook
   */
  async sendWebhookMessage(channel: string, text: string, blocks?: any[]): Promise<void> {
    if (!this.webhookUrl) {
      throw new Error('Slack webhook URL not configured')
    }

    try {
      await axios.post(this.webhookUrl, {
        channel,
        text,
        blocks,
      })
    } catch (error: any) {
      throw new Error(`Slack webhook error: ${error.message}`)
    }
  }

  /**
   * Send message via API
   */
  async sendMessage(channel: string, text: string): Promise<void> {
    if (!this.botToken) {
      throw new Error('Slack bot token not configured')
    }

    try {
      await this.api.post('/chat.postMessage', {
        channel,
        text,
      })
    } catch (error: any) {
      throw new Error(`Slack API error: ${error.message}`)
    }
  }

  /**
   * Send notification for client event
   */
  async notifyClientEvent(event: string, clientData: any): Promise<void> {
    const message = `*${event}*\nClient: ${clientData.firstName} ${clientData.lastName}\nEmail: ${clientData.email}`
    await this.sendWebhookMessage('#credit-crm', message)
  }
}

