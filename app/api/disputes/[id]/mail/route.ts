/**
 * Mail Dispute Letter Endpoint
 * Automated dispute letter mailing via Click2Mail
 * RJ Business Solutions - Rick Jefferson
 */

import { NextRequest, NextResponse } from 'next/server'
import { disputeMailerService } from '@/lib/integrations/dispute-mailer'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { returnAddress, mailClass } = body

    const result = await disputeMailerService.mailDispute(params.id, {
      returnAddress,
      mailClass,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Dispute letter mailed successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * Check mailing status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await disputeMailerService.checkMailingStatus(params.id)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

