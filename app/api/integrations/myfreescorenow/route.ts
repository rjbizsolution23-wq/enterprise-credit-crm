/**
 * MyFreeScoreNow API Routes
 * RJ Business Solutions - Rick Jefferson
 */

import { NextRequest, NextResponse } from 'next/server'
import { mfsnClient } from '@/lib/integrations/myfreescorenow'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    let result

    switch (action) {
      case 'get3BReportJSON':
        result = await mfsnClient.get3BReportJSON(params.username, params.password)
        break
      case 'get3BReportHTML':
        result = await mfsnClient.get3BReportHTML(params.username, params.password)
        break
      case 'getEpicProReportJSON':
        result = await mfsnClient.getEpicProReportJSON(params.username, params.password)
        break
      case 'getEpicProReportHTML':
        result = await mfsnClient.getEpicProReportHTML(params.username, params.password)
        break
      case 'startEnrollment':
        result = await mfsnClient.startEnrollment(params)
        break
      case 'idVerification':
        result = await mfsnClient.idVerification(params)
        break
      case 'updateCard':
        result = await mfsnClient.updateCard(params)
        break
      case 'updateSecurityQuestions':
        result = await mfsnClient.updateSecurityQuestions(params)
        break
      case 'startSnapshotCreditEnrollment':
        result = await mfsnClient.startSnapshotCreditEnrollment(params)
        break
      case 'startSnapshotFundingEnrollment':
        result = await mfsnClient.startSnapshotFundingEnrollment(params)
        break
      case 'verifySnapshotCreditEnrollment':
        result = await mfsnClient.verifySnapshotCreditEnrollment(params)
        break
      case 'verifySnapshotFundingEnrollment':
        result = await mfsnClient.verifySnapshotFundingEnrollment(params)
        break
      case 'getSnapshotCreditScore':
        result = await mfsnClient.getSnapshotCreditScore(params)
        break
      case 'getSnapshotFundingScore':
        result = await mfsnClient.getSnapshotFundingScore(params)
        break
      case 'login':
        result = { token: await mfsnClient.login() }
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
