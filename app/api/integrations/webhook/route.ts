/**
 * Universal Webhook Endpoint
 * Handles Zapier, Make.com, and custom webhooks
 * RJ Business Solutions - Rick Jefferson
 */

import { NextRequest, NextResponse } from 'next/server'
import { zapierIntegration } from '@/lib/integrations/zapier'
import { MakeIntegration } from '@/lib/integrations/make'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, event, data, webhookUrl, scenarioId } = body

    switch (provider) {
      case 'zapier':
        if (webhookUrl) {
          await zapierIntegration.triggerWebhook(webhookUrl, data)
        } else {
          await zapierIntegration.triggerEvent(event, data)
        }
        break

      case 'make':
      case 'integromat':
        const makeIntegration = new MakeIntegration()
        if (scenarioId) {
          await makeIntegration.triggerScenario(scenarioId, data)
        } else if (webhookUrl) {
          await makeIntegration.triggerWebhook(webhookUrl, data)
        } else {
          return NextResponse.json(
            { success: false, error: 'scenarioId or webhookUrl required for Make.com' },
            { status: 400 }
          )
        }
        break

      case 'custom':
        if (!webhookUrl) {
          return NextResponse.json(
            { success: false, error: 'webhookUrl required for custom webhooks' },
            { status: 400 }
          )
        }
        // Trigger custom webhook
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
        })
        if (!response.ok) {
          throw new Error(`Webhook failed: ${response.statusText}`)
        }
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid provider. Use: zapier, make, or custom' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, message: 'Webhook triggered successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

