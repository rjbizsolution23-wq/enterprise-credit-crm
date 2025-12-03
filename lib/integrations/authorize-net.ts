/**
 * Authorize.Net Payment Integration
 * Alternative payment processor
 * RJ Business Solutions - Rick Jefferson
 */

import axios from 'axios'

export class AuthorizeNetService {
  private apiLoginId: string
  private transactionKey: string
  private gatewayId: string
  private baseUrl: string

  constructor() {
    this.apiLoginId = process.env.AUTHORIZE_NET_API_LOGIN_ID || ''
    this.transactionKey = process.env.AUTHORIZE_NET_TRANSACTION_KEY || ''
    this.gatewayId = process.env.AUTHORIZE_NET_PAYMENT_GATEWAY_ID || ''
    this.baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://api.authorize.net/xml/v1/request.api'
      : 'https://apitest.authorize.net/xml/v1/request.api'
  }

  /**
   * Create transaction
   */
  async createTransaction(data: {
    amount: number
    cardNumber: string
    expirationDate: string
    cardCode?: string
    customerData?: any
  }): Promise<any> {
    try {
      const response = await axios.post(this.baseUrl, {
        createTransactionRequest: {
          merchantAuthentication: {
            name: this.apiLoginId,
            transactionKey: this.transactionKey,
          },
          transactionRequest: {
            transactionType: 'authCaptureTransaction',
            amount: data.amount.toFixed(2),
            payment: {
              creditCard: {
                cardNumber: data.cardNumber,
                expirationDate: data.expirationDate,
                cardCode: data.cardCode,
              },
            },
            customer: data.customerData,
          },
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(`Authorize.Net transaction error: ${error.message}`)
    }
  }

  /**
   * Refund transaction
   */
  async refundTransaction(transactionId: string, amount: number): Promise<any> {
    try {
      const response = await axios.post(this.baseUrl, {
        createTransactionRequest: {
          merchantAuthentication: {
            name: this.apiLoginId,
            transactionKey: this.transactionKey,
          },
          transactionRequest: {
            transactionType: 'refundTransaction',
            refTransId: transactionId,
            amount: amount.toFixed(2),
          },
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(`Authorize.Net refund error: ${error.message}`)
    }
  }
}

