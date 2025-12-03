/**
 * Batch Mail Dispute Letters
 * Mail multiple dispute letters at once
 * RJ Business Solutions - Rick Jefferson
 */

import { NextRequest, NextResponse } from 'next/server'
import { disputeMailerService } from '@/lib/integrations/dispute-mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disputeIds, returnAddress, mailClass } = body

    if (!disputeIds || !Array.isArray(disputeIds) || disputeIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'disputeIds array required' },
        { status: 400 }
      )
    }

    const result = await disputeMailerService.mailDisputesBatch(disputeIds, {
      returnAddress,
      mailClass,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: `Successfully mailed ${result.disputeCount} dispute letters`,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

