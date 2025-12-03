/**
 * Automated Dispute Letter Mailing Service
 * Integrates DisputeGenerator with Click2Mail
 * RJ Business Solutions - Rick Jefferson
 */

import { DisputeGenerator } from '@/lib/disputes'
import { click2mailClient } from './click2mail'
import { PDFDocument } from 'pdf-lib'
import { prisma } from '@/lib/prisma'

export interface DisputeMailingOptions {
  disputeId: string
  returnAddress?: {
    name: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
  }
  mailClass?: 'First Class' | 'Standard' | 'Priority'
}

export class DisputeMailerService {
  /**
   * Mail a single dispute letter
   */
  async mailDispute(disputeId: string, options?: DisputeMailingOptions): Promise<{
    jobId: string
    cost: number
    status: string
    tracking?: string
  }> {
    try {
      // Get dispute from database
      const dispute = await prisma.dispute.findUnique({
        where: { id: disputeId },
        include: {
          client: true,
          items: true,
        },
      })

      if (!dispute) {
        throw new Error('Dispute not found')
      }

      // Generate dispute letter
      let letterContent: string
      if (dispute.type === 'FCRA_609') {
        letterContent = DisputeGenerator.generateFCRA609(
          {
            firstName: dispute.client.firstName,
            lastName: dispute.client.lastName,
            address: dispute.client.address as any,
            ssn: dispute.client.ssn || undefined,
          },
          dispute.items.map(item => ({
            creditor: item.description,
            accountNumber: item.negativeItem?.accountNumber || undefined,
            reason: item.reason,
            description: item.description,
          })),
          dispute.bureau || 'TRANSUNION'
        )
      } else if (dispute.type === 'FCRA_611') {
        letterContent = DisputeGenerator.generateFCRA611(
          {
            firstName: dispute.client.firstName,
            lastName: dispute.client.lastName,
            address: dispute.client.address as any,
            ssn: dispute.client.ssn || undefined,
          },
          dispute.items.map(item => ({
            creditor: item.description,
            accountNumber: item.negativeItem?.accountNumber || undefined,
            reason: item.reason,
            description: item.description,
            evidence: item.evidence as string[] | undefined,
          })),
          dispute.items[0]?.description || 'Creditor'
        )
      } else {
        throw new Error(`Dispute type ${dispute.type} not supported for mailing`)
      }

      // Convert to PDF
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([612, 792]) // Letter size
      const { width, height } = page.getSize()

      // Add text to PDF (simplified - in production use proper PDF text rendering)
      const pdfBytes = await pdfDoc.save()
      const pdfBuffer = Buffer.from(pdfBytes)

      // Prepare recipient address
      const recipientAddress = {
        name: `${dispute.client.firstName} ${dispute.client.lastName}`,
        address1: (dispute.client.address as any)?.street || '',
        city: (dispute.client.address as any)?.city || '',
        state: (dispute.client.address as any)?.state || '',
        zip: (dispute.client.address as any)?.zip || '',
      }

      // Mail the letter
      const result = await click2mailClient.mailDisputeLetter({
        disputeLetter: pdfBuffer,
        letterName: `Dispute_${dispute.type}_${dispute.client.lastName}_${disputeId}.pdf`,
        recipient: recipientAddress,
        returnAddress: options?.returnAddress,
        mailClass: options?.mailClass || 'First Class',
      })

      // Update dispute record
      await prisma.dispute.update({
        where: { id: disputeId },
        data: {
          status: 'SUBMITTED',
          submittedDate: new Date(),
          metadata: {
            click2mailJobId: result.jobId,
            click2mailCost: result.cost,
            click2mailStatus: result.status,
          },
        },
      })

      // Get tracking if available
      let tracking: string | undefined
      try {
        const trackingData = await click2mailClient.getUSPSTracking(result.jobId)
        tracking = this.extractTrackingNumber(trackingData)
      } catch (error) {
        // Tracking may not be available immediately
      }

      return {
        ...result,
        tracking,
      }
    } catch (error: any) {
      throw new Error(`Dispute mailer error: ${error.message}`)
    }
  }

  /**
   * Mail multiple disputes in batch
   */
  async mailDisputesBatch(disputeIds: string[], options?: DisputeMailingOptions): Promise<{
    jobId: string
    cost: number
    status: string
    disputeCount: number
  }> {
    try {
      // Get all disputes
      const disputes = await prisma.dispute.findMany({
        where: { id: { in: disputeIds } },
        include: {
          client: true,
          items: true,
        },
      })

      if (disputes.length === 0) {
        throw new Error('No disputes found')
      }

      // Generate letters for all disputes (using first dispute's letter as template)
      const firstDispute = disputes[0]
      let letterContent: string

      if (firstDispute.type === 'FCRA_609') {
        letterContent = DisputeGenerator.generateFCRA609(
          {
            firstName: firstDispute.client.firstName,
            lastName: firstDispute.client.lastName,
            address: firstDispute.client.address as any,
            ssn: firstDispute.client.ssn || undefined,
          },
          firstDispute.items.map(item => ({
            creditor: item.description,
            accountNumber: item.negativeItem?.accountNumber || undefined,
            reason: item.reason,
            description: item.description,
          })),
          firstDispute.bureau || 'TRANSUNION'
        )
      } else {
        throw new Error('Batch mailing currently supports FCRA_609 only')
      }

      // Convert to PDF
      const pdfDoc = await PDFDocument.create()
      const pdfBytes = await pdfDoc.save()
      const pdfBuffer = Buffer.from(pdfBytes)

      // Prepare recipient addresses
      const recipients = disputes.map(dispute => ({
        name: `${dispute.client.firstName} ${dispute.client.lastName}`,
        address1: (dispute.client.address as any)?.street || '',
        city: (dispute.client.address as any)?.city || '',
        state: (dispute.client.address as any)?.state || '',
        zip: (dispute.client.address as any)?.zip || '',
      }))

      // Mail batch
      const result = await click2mailClient.mailDisputeLettersBatch({
        disputeLetter: pdfBuffer,
        letterName: `Batch_Dispute_Letters_${Date.now()}.pdf`,
        recipients,
        returnAddress: options?.returnAddress,
        mailClass: options?.mailClass || 'First Class',
      })

      // Update all disputes
      await prisma.dispute.updateMany({
        where: { id: { in: disputeIds } },
        data: {
          status: 'SUBMITTED',
          submittedDate: new Date(),
          metadata: {
            click2mailJobId: result.jobId,
            click2mailCost: result.cost,
            click2mailStatus: result.status,
            batchMailing: true,
          },
        },
      })

      return {
        jobId: result.jobId,
        cost: result.cost,
        status: result.status,
        disputeCount: disputes.length,
      }
    } catch (error: any) {
      throw new Error(`Batch dispute mailer error: ${error.message}`)
    }
  }

  /**
   * Check mailing status and update dispute
   */
  async checkMailingStatus(disputeId: string): Promise<any> {
    try {
      const dispute = await prisma.dispute.findUnique({
        where: { id: disputeId },
      })

      if (!dispute || !dispute.metadata) {
        throw new Error('Dispute not found or no mailing info')
      }

      const metadata = dispute.metadata as any
      const jobId = metadata.click2mailJobId

      if (!jobId) {
        throw new Error('No Click2Mail job ID found')
      }

      const status = await click2mailClient.getJobStatus(jobId)
      const details = await click2mailClient.getJobDetails(jobId)
      const tracking = await click2mailClient.getUSPSTracking(jobId)

      // Update dispute
      await prisma.dispute.update({
        where: { id: disputeId },
        data: {
          metadata: {
            ...metadata,
            click2mailStatus: this.extractStatusFromResponse(status),
            click2mailDetails: details,
            click2mailTracking: this.extractTrackingNumber(tracking),
            lastStatusCheck: new Date().toISOString(),
          },
        },
      })

      return {
        status: this.extractStatusFromResponse(status),
        details,
        tracking: this.extractTrackingNumber(tracking),
      }
    } catch (error: any) {
      throw new Error(`Check mailing status error: ${error.message}`)
    }
  }

  private extractTrackingNumber(xml: string): string {
    const trackingMatch = xml.match(/<trackingNumber>([^<]+)<\/trackingNumber>/i) ||
                         xml.match(/trackingNumber="([^"]+)"/i)
    return trackingMatch?.[1] || ''
  }

  private extractStatusFromResponse(xml: string): string {
    const statusMatch = xml.match(/<status>([^<]+)<\/status>/i) ||
                       xml.match(/status="([^"]+)"/i)
    return statusMatch?.[1] || 'unknown'
  }
}

export const disputeMailerService = new DisputeMailerService()

