/**
 * Make.com (Integromat) Webhook Endpoints
 * RJ Business Solutions - Rick Jefferson
 */

import { NextRequest, NextResponse } from 'next/server'
import { MakeIntegration } from '@/lib/integrations/make'

const makeIntegration = new MakeIntegration()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scenarioId, data } = body

    if (scenarioId) {
      await makeIntegration.triggerScenario(scenarioId, data)
    } else {
      // Direct webhook URL
      const webhookUrl = body.webhookUrl
      if (!webhookUrl) {
        return NextResponse.json(
          { success: false, error: 'scenarioId or webhookUrl required' },
          { status: 400 }
        )
      }
      await makeIntegration.triggerWebhook(webhookUrl, data)
    }

    return NextResponse.json({ success: true, message: 'Make.com webhook triggered' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
