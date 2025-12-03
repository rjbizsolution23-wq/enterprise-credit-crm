/**
 * Zapier Webhook Endpoints
 * RJ Business Solutions - Rick Jefferson
 */

import { NextRequest, NextResponse } from 'next/server'
import { zapierIntegration } from '@/lib/integrations/zapier'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Handle different event types
    switch (event) {
      case 'client.created':
        await zapierIntegration.onClientCreated(data)
        break
      case 'client.updated':
        await zapierIntegration.onClientUpdated(data)
        break
      case 'dispute.submitted':
        await zapierIntegration.onDisputeSubmitted(data)
        break
      case 'payment.received':
        await zapierIntegration.onPaymentReceived(data)
        break
      case 'score.updated':
        await zapierIntegration.onScoreUpdated(data)
        break
      case 'tradeline.added':
        await zapierIntegration.onTradelineAdded(data)
        break
      case 'task.completed':
        await zapierIntegration.onTaskCompleted(data)
        break
      default:
        await zapierIntegration.triggerEvent(event, data)
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * Register Zapier webhook
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, url, events } = body

    zapierIntegration.registerWebhook({
      id,
      name,
      url,
      events: Array.isArray(events) ? events : [events],
      active: true,
    })

    return NextResponse.json({ success: true, message: 'Webhook registered' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
