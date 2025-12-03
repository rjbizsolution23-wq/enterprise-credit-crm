/**
 * Zapier Integration Module
 * Webhook endpoints and automation triggers
 * RJ Business Solutions - Rick Jefferson
 */

import axios from 'axios'

export interface ZapierWebhook {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
}

export interface ZapierTrigger {
  clientId: string
  event: string
  data: any
  timestamp: string
}

export class ZapierIntegration {
  private webhooks: Map<string, ZapierWebhook> = new Map()

  /**
   * Register a Zapier webhook
   */
  registerWebhook(webhook: ZapierWebhook): void {
    this.webhooks.set(webhook.id, webhook)
  }

  /**
   * Trigger a Zapier webhook
   */
  async triggerWebhook(webhookId: string, data: any): Promise<void> {
    const webhook = this.webhooks.get(webhookId)
    if (!webhook || !webhook.active) {
      throw new Error(`Webhook ${webhookId} not found or inactive`)
    }

    try {
      await axios.post(webhook.url, {
        event: webhook.events[0],
        data,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      throw new Error(`Zapier webhook trigger failed: ${error.message}`)
    }
  }

  /**
   * Trigger multiple webhooks for an event
   */
  async triggerEvent(event: string, data: any): Promise<void> {
    const relevantWebhooks = Array.from(this.webhooks.values()).filter(
      (wh) => wh.active && wh.events.includes(event)
    )

    await Promise.all(
      relevantWebhooks.map((webhook) =>
        axios.post(webhook.url, {
          event,
          data,
          timestamp: new Date().toISOString(),
        }).catch((error) => {
          console.error(`Failed to trigger webhook ${webhook.id}:`, error)
        })
      )
    )
  }

  /**
   * Client created trigger
   */
  async onClientCreated(clientData: any): Promise<void> {
    await this.triggerEvent('client.created', clientData)
  }

  /**
   * Client updated trigger
   */
  async onClientUpdated(clientData: any): Promise<void> {
    await this.triggerEvent('client.updated', clientData)
  }

  /**
   * Dispute submitted trigger
   */
  async onDisputeSubmitted(disputeData: any): Promise<void> {
    await this.triggerEvent('dispute.submitted', disputeData)
  }

  /**
   * Payment received trigger
   */
  async onPaymentReceived(paymentData: any): Promise<void> {
    await this.triggerEvent('payment.received', paymentData)
  }

  /**
   * Score updated trigger
   */
  async onScoreUpdated(scoreData: any): Promise<void> {
    await this.triggerEvent('score.updated', scoreData)
  }

  /**
   * Tradeline added trigger
   */
  async onTradelineAdded(tradelineData: any): Promise<void> {
    await this.triggerEvent('tradeline.added', tradelineData)
  }

  /**
   * Task completed trigger
   */
  async onTaskCompleted(taskData: any): Promise<void> {
    await this.triggerEvent('task.completed', taskData)
  }
}

export const zapierIntegration = new ZapierIntegration()
