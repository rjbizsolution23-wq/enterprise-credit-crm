/**
 * Click2Mail API Routes
 * Automated dispute letter mailing
 * RJ Business Solutions - Rick Jefferson
 */

import { NextRequest, NextResponse } from 'next/server'
import { click2mailClient } from '@/lib/integrations/click2mail'
import { DisputeGenerator } from '@/lib/disputes'
import { pdf } from 'pdf-lib'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    let result

    switch (action) {
      case 'mailDisputeLetter':
        // Generate dispute letter PDF
        const letterContent = DisputeGenerator.generateFCRA609(
          params.client,
          params.items,
          params.bureau
        )

        // Convert to PDF (simplified - you'd use pdf-lib here)
        const pdfBuffer = Buffer.from(letterContent) // In production, convert to actual PDF

        result = await click2mailClient.mailDisputeLetter({
          disputeLetter: pdfBuffer,
          letterName: `Dispute_Letter_${params.client.lastName}_${Date.now()}.pdf`,
          recipient: params.recipient,
          returnAddress: params.returnAddress,
          mailClass: params.mailClass || 'First Class',
        })
        break

      case 'mailDisputeLettersBatch':
        const batchLetterContent = DisputeGenerator.generateFCRA609(
          params.client,
          params.items,
          params.bureau
        )
        const batchPdfBuffer = Buffer.from(batchLetterContent)

        result = await click2mailClient.mailDisputeLettersBatch({
          disputeLetter: batchPdfBuffer,
          letterName: `Batch_Dispute_Letters_${Date.now()}.pdf`,
          recipients: params.recipients,
          returnAddress: params.returnAddress,
          mailClass: params.mailClass || 'First Class',
        })
        break

      case 'uploadDocument':
        result = { documentId: await click2mailClient.uploadDocument(params) }
        break

      case 'createAddressList':
        result = { addressListId: await click2mailClient.createAddressList(params.name, params.addresses) }
        break

      case 'createJob':
        result = { jobId: await click2mailClient.createJob(params) }
        break

      case 'submitJob':
        result = await click2mailClient.submitJob(params.jobId)
        break

      case 'getJobStatus':
        result = await click2mailClient.getJobStatus(params.jobId)
        break

      case 'getJobDetails':
        result = await click2mailClient.getJobDetails(params.jobId)
        break

      case 'getJobCost':
        result = await click2mailClient.getJobCost(params.jobId)
        break

      case 'getUSPSTracking':
        result = await click2mailClient.getUSPSTracking(params.jobId)
        break

      case 'getCreditBalance':
        result = await click2mailClient.getCreditBalance()
        break

      case 'purchaseCredit':
        result = await click2mailClient.purchaseCredit(params.amount, params.creditCard)
        break

      case 'getAccountAddresses':
        result = await click2mailClient.getAccountAddresses(params.type)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

