/**
 * QuickBooks Integration
 * Accounting and invoicing
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class QuickBooksService {
  private api: AxiosInstance
  private accessToken: string
  private companyId: string

  constructor() {
    this.accessToken = process.env.QUICKBOOKS_ACCESS_TOKEN || ''
    this.companyId = process.env.QUICKBOOKS_COMPANY_ID || ''

    this.api = axios.create({
      baseURL: `https://sandbox-quickbooks.api.intuit.com/v3/company/${this.companyId}`,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
  }

  /**
   * Create customer
   */
  async createCustomer(data: {
    displayName: string
    email?: string
    phone?: string
    billingAddress?: any
  }): Promise<any> {
    try {
      const response = await this.api.post('/customer', {
        DisplayName: data.displayName,
        PrimaryEmailAddr: data.email ? { Address: data.email } : undefined,
        PrimaryPhone: data.phone ? { FreeFormNumber: data.phone } : undefined,
        BillAddr: data.billingAddress,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`QuickBooks create customer error: ${error.message}`)
    }
  }

  /**
   * Create invoice
   */
  async createInvoice(data: {
    customerId: string
    lineItems: Array<{
      description: string
      amount: number
    }>
    dueDate?: string
  }): Promise<any> {
    try {
      const response = await this.api.post('/invoice', {
        CustomerRef: { value: data.customerId },
        Line: data.lineItems.map((item) => ({
          DetailType: 'SalesItemLineDetail',
          Amount: item.amount,
          SalesItemLineDetail: {
            ItemRef: { value: '1' },
          },
          Description: item.description,
        })),
        DueDate: data.dueDate || new Date().toISOString().split('T')[0],
      })
      return response.data
    } catch (error: any) {
      throw new Error(`QuickBooks create invoice error: ${error.message}`)
    }
  }
}

