/**
 * Click2Mail Integration
 * Automated direct mail for dispute letters
 * RJ Business Solutions - Rick Jefferson
 * 
 * API Documentation:
 * - https://developers.click2mail.com/reference/getaccountaddresses
 * - https://developers.click2mail.com/docs/getting-started
 * - https://developers.click2mail.com/docs/building-your-first-api-call
 */

import axios, { AxiosInstance } from 'axios'

export interface Click2MailConfig {
  username: string
  password: string
  environment?: 'production' | 'stage'
}

export interface Click2MailAddress {
  name?: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  country?: string
}

export interface Click2MailDocument {
  documentName: string
  documentContent: Buffer | string
  documentType?: 'pdf' | 'doc' | 'docx' | 'html'
}

export interface Click2MailJob {
  documentId: string
  addressListId: string
  returnAddressId?: string
  mailClass?: 'First Class' | 'Standard' | 'Priority'
  printOptions?: {
    color?: boolean
    duplex?: boolean
    paperSize?: string
  }
}

export class Click2MailClient {
  private api: AxiosInstance
  private config: Click2MailConfig
  private baseUrl: string

  constructor(config: Click2MailConfig) {
    this.config = {
      environment: 'production',
      ...config,
    }

    this.baseUrl = this.config.environment === 'production'
      ? 'https://rest.click2mail.com/molpro'
      : 'https://stage-rest.click2mail.com/molpro'

    // Create axios instance with basic auth
    this.api = axios.create({
      baseURL: this.baseUrl,
      auth: {
        username: this.config.username,
        password: this.config.password,
      },
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
    })
  }

  /**
   * Get account addresses
   * https://developers.click2mail.com/reference/getaccountaddresses
   */
  async getAccountAddresses(type?: 'return' | 'reply' | 'billing' | 'eddm'): Promise<any> {
    try {
      const params = type ? { type } : {}
      const response = await this.api.get('/account/addresses', { params })
      return response.data
    } catch (error: any) {
      throw new Error(`Click2Mail get account addresses error: ${error.message}`)
    }
  }

  /**
   * Create account address
   */
  async createAccountAddress(address: Click2MailAddress, type: string): Promise<string> {
    try {
      const xml = this.buildAddressXML(address, type)
      const response = await this.api.post('/account/addresses', xml, {
        headers: { 'Content-Type': 'application/xml' },
      })
      return this.extractIdFromResponse(response.data)
    } catch (error: any) {
      throw new Error(`Click2Mail create address error: ${error.message}`)
    }
  }

  /**
   * Upload document
   * https://developers.click2mail.com/reference/createdocument
   */
  async uploadDocument(document: Click2MailDocument): Promise<string> {
    try {
      const formData = new FormData()
      const blob = document.documentContent instanceof Buffer
        ? new Blob([document.documentContent])
        : new Blob([document.documentContent])

      formData.append('file', blob, document.documentName)
      formData.append('documentName', document.documentName)

      const response = await this.api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/xml',
        },
      })

      return this.extractIdFromResponse(response.data)
    } catch (error: any) {
      throw new Error(`Click2Mail upload document error: ${error.message}`)
    }
  }

  /**
   * Create document from URL
   */
  async createDocumentFromURL(documentName: string, url: string): Promise<string> {
    try {
      const response = await this.api.post('/documents/url', {
        documentName,
        url,
      }, {
        headers: { 'Content-Type': 'application/json' },
      })
      return this.extractIdFromResponse(response.data)
    } catch (error: any) {
      throw new Error(`Click2Mail create document from URL error: ${error.message}`)
    }
  }

  /**
   * Create address list
   * https://developers.click2mail.com/reference/createanaddresslist
   */
  async createAddressList(name: string, addresses: Click2MailAddress[]): Promise<string> {
    try {
      const xml = this.buildAddressListXML(name, addresses)
      const response = await this.api.post('/addressLists', xml, {
        headers: { 'Content-Type': 'application/xml' },
      })
      return this.extractIdFromResponse(response.data)
    } catch (error: any) {
      throw new Error(`Click2Mail create address list error: ${error.message}`)
    }
  }

  /**
   * Create mail job
   * https://developers.click2mail.com/reference/createajob
   */
  async createJob(job: Click2MailJob): Promise<string> {
    try {
      const xml = this.buildJobXML(job)
      const response = await this.api.post('/jobs', xml, {
        headers: { 'Content-Type': 'application/xml' },
      })
      return this.extractIdFromResponse(response.data)
    } catch (error: any) {
      throw new Error(`Click2Mail create job error: ${error.message}`)
    }
  }

  /**
   * Submit job
   * https://developers.click2mail.com/reference/submitajob
   */
  async submitJob(jobId: string): Promise<any> {
    try {
      const response = await this.api.post(`/jobs/${jobId}/submit`)
      return response.data
    } catch (error: any) {
      throw new Error(`Click2Mail submit job error: ${error.message}`)
    }
  }

  /**
   * Get job status
   * https://developers.click2mail.com/reference/checkjobstatus
   */
  async getJobStatus(jobId: string): Promise<any> {
    try {
      const response = await this.api.get(`/jobs/${jobId}/status`)
      return response.data
    } catch (error: any) {
      throw new Error(`Click2Mail get job status error: ${error.message}`)
    }
  }

  /**
   * Get job details
   * https://developers.click2mail.com/reference/getjobdetails
   */
  async getJobDetails(jobId: string): Promise<any> {
    try {
      const response = await this.api.get(`/jobs/${jobId}`)
      return response.data
    } catch (error: any) {
      throw new Error(`Click2Mail get job details error: ${error.message}`)
    }
  }

  /**
   * Get job cost
   * https://developers.click2mail.com/reference/getajobcost
   */
  async getJobCost(jobId: string): Promise<any> {
    try {
      const response = await this.api.get(`/jobs/${jobId}/cost`)
      return response.data
    } catch (error: any) {
      throw new Error(`Click2Mail get job cost error: ${error.message}`)
    }
  }

  /**
   * Get USPS tracking
   * https://developers.click2mail.com/reference/requestuspstracking
   */
  async getUSPSTracking(jobId: string): Promise<any> {
    try {
      const response = await this.api.get(`/jobs/${jobId}/tracking`)
      return response.data
    } catch (error: any) {
      throw new Error(`Click2Mail get USPS tracking error: ${error.message}`)
    }
  }

  /**
   * Check credit balance
   * https://developers.click2mail.com/reference/checkcreditbalance
   */
  async getCreditBalance(): Promise<{ balance: number; allowNegative: boolean }> {
    try {
      const response = await this.api.get('/credit')
      const xml = response.data
      
      // Parse XML response
      const balanceMatch = xml.match(/<balance>([^<]+)<\/balance>/)
      const allowNegativeMatch = xml.match(/<allowNegative>([^<]+)<\/allowNegative>/)
      
      return {
        balance: parseFloat(balanceMatch?.[1] || '0'),
        allowNegative: allowNegativeMatch?.[1] === 'true',
      }
    } catch (error: any) {
      throw new Error(`Click2Mail get credit balance error: ${error.message}`)
    }
  }

  /**
   * Purchase credit
   * https://developers.click2mail.com/reference/purchasecredit
   */
  async purchaseCredit(amount: number, creditCard?: any): Promise<any> {
    try {
      const xml = this.buildCreditPurchaseXML(amount, creditCard)
      const response = await this.api.post('/credit/purchase', xml, {
        headers: { 'Content-Type': 'application/xml' },
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Click2Mail purchase credit error: ${error.message}`)
    }
  }

  /**
   * Mail dispute letter (Complete workflow)
   */
  async mailDisputeLetter(data: {
    disputeLetter: Buffer | string
    letterName: string
    recipient: Click2MailAddress
    returnAddress?: Click2MailAddress
    mailClass?: 'First Class' | 'Standard' | 'Priority'
  }): Promise<{ jobId: string; cost: number; status: string }> {
    try {
      // 1. Upload document
      const documentId = await this.uploadDocument({
        documentName: data.letterName,
        documentContent: data.disputeLetter,
        documentType: 'pdf',
      })

      // 2. Create address list with single recipient
      const addressListId = await this.createAddressList(
        `Dispute Letter - ${data.recipient.name || 'Client'}`,
        [data.recipient]
      )

      // 3. Get or create return address
      let returnAddressId: string | undefined
      if (data.returnAddress) {
        const addresses = await this.getAccountAddresses('return')
        // Try to find existing or create new
        returnAddressId = await this.createAccountAddress(data.returnAddress, 'return')
      }

      // 4. Create job
      const jobId = await this.createJob({
        documentId,
        addressListId,
        returnAddressId,
        mailClass: data.mailClass || 'First Class',
        printOptions: {
          color: false,
          duplex: false,
        },
      })

      // 5. Get cost estimate
      const costData = await this.getJobCost(jobId)
      const cost = this.extractCostFromResponse(costData)

      // 6. Submit job
      await this.submitJob(jobId)

      // 7. Get status
      const statusData = await this.getJobStatus(jobId)
      const status = this.extractStatusFromResponse(statusData)

      return {
        jobId,
        cost,
        status,
      }
    } catch (error: any) {
      throw new Error(`Click2Mail mail dispute letter error: ${error.message}`)
    }
  }

  /**
   * Mail multiple dispute letters (Batch)
   */
  async mailDisputeLettersBatch(data: {
    disputeLetter: Buffer | string
    letterName: string
    recipients: Click2MailAddress[]
    returnAddress?: Click2MailAddress
    mailClass?: 'First Class' | 'Standard' | 'Priority'
  }): Promise<{ jobId: string; cost: number; status: string; recipientCount: number }> {
    try {
      // 1. Upload document
      const documentId = await this.uploadDocument({
        documentName: data.letterName,
        documentContent: data.disputeLetter,
        documentType: 'pdf',
      })

      // 2. Create address list with all recipients
      const addressListId = await this.createAddressList(
        `Batch Dispute Letters - ${data.recipients.length} recipients`,
        data.recipients
      )

      // 3. Get or create return address
      let returnAddressId: string | undefined
      if (data.returnAddress) {
        returnAddressId = await this.createAccountAddress(data.returnAddress, 'return')
      }

      // 4. Create job
      const jobId = await this.createJob({
        documentId,
        addressListId,
        returnAddressId,
        mailClass: data.mailClass || 'First Class',
        printOptions: {
          color: false,
          duplex: false,
        },
      })

      // 5. Get cost estimate
      const costData = await this.getJobCost(jobId)
      const cost = this.extractCostFromResponse(costData)

      // 6. Submit job
      await this.submitJob(jobId)

      // 7. Get status
      const statusData = await this.getJobStatus(jobId)
      const status = this.extractStatusFromResponse(statusData)

      return {
        jobId,
        cost,
        status,
        recipientCount: data.recipients.length,
      }
    } catch (error: any) {
      throw new Error(`Click2Mail batch mail dispute letters error: ${error.message}`)
    }
  }

  // Helper methods for XML building and parsing

  private buildAddressXML(address: Click2MailAddress, type: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<address>
  <type>${type}</type>
  <name>${address.name || ''}</name>
  <company>${address.company || ''}</company>
  <address1>${address.address1}</address1>
  <address2>${address.address2 || ''}</address2>
  <city>${address.city}</city>
  <state>${address.state}</state>
  <zip>${address.zip}</zip>
  <country>${address.country || 'US'}</country>
</address>`
  }

  private buildAddressListXML(name: string, addresses: Click2MailAddress[]): string {
    const addressXML = addresses.map(addr => `
  <address>
    <name>${addr.name || ''}</name>
    <company>${addr.company || ''}</company>
    <address1>${addr.address1}</address1>
    <address2>${addr.address2 || ''}</address2>
    <city>${addr.city}</city>
    <state>${addr.state}</state>
    <zip>${addr.zip}</zip>
    <country>${addr.country || 'US'}</country>
  </address>`).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<addressList>
  <name>${name}</name>
  <addresses>${addressXML}
  </addresses>
</addressList>`
  }

  private buildJobXML(job: Click2MailJob): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<job>
  <documentId>${job.documentId}</documentId>
  <addressListId>${job.addressListId}</addressListId>
  ${job.returnAddressId ? `<returnAddressId>${job.returnAddressId}</returnAddressId>` : ''}
  <mailClass>${job.mailClass || 'First Class'}</mailClass>
  ${job.printOptions ? `
  <printOptions>
    <color>${job.printOptions.color ? 'true' : 'false'}</color>
    <duplex>${job.printOptions.duplex ? 'true' : 'false'}</duplex>
    ${job.printOptions.paperSize ? `<paperSize>${job.printOptions.paperSize}</paperSize>` : ''}
  </printOptions>` : ''}
</job>`
  }

  private buildCreditPurchaseXML(amount: number, creditCard?: any): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<creditPurchase>
  <amount>${amount}</amount>
  ${creditCard ? `
  <creditCard>
    <number>${creditCard.number}</number>
    <expirationDate>${creditCard.expirationDate}</expirationDate>
    <cvv>${creditCard.cvv}</cvv>
  </creditCard>` : ''}
</creditPurchase>`
  }

  private extractIdFromResponse(xml: string): string {
    // Extract ID from XML response
    const idMatch = xml.match(/<id>([^<]+)<\/id>/i) || xml.match(/id="([^"]+)"/i)
    return idMatch?.[1] || ''
  }

  private extractCostFromResponse(xml: string): number {
    const costMatch = xml.match(/<cost>([^<]+)<\/cost>/i) || xml.match(/cost="([^"]+)"/i)
    return parseFloat(costMatch?.[1] || '0')
  }

  private extractStatusFromResponse(xml: string): string {
    const statusMatch = xml.match(/<status>([^<]+)<\/status>/i) || xml.match(/status="([^"]+)"/i)
    return statusMatch?.[1] || 'unknown'
  }
}

// Export singleton instance
export const click2mailClient = new Click2MailClient({
  username: process.env.CLICK2MAIL_USERNAME || 'rj1006',
  password: process.env.CLICK2MAIL_PASSWORD || '',
  environment: (process.env.CLICK2MAIL_ENVIRONMENT as 'production' | 'stage') || 'production',
})

