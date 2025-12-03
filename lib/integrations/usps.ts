/**
 * USPS API Integration
 * Address verification, mail tracking, label generation
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export interface USPSAddress {
  street: string
  city: string
  state: string
  zip: string
}

export interface USPSVerifyResponse {
  address: USPSAddress
  verified: boolean
  standardized?: USPSAddress
}

export class USPSClient {
  private api: AxiosInstance
  private consumerKey: string
  private consumerSecret: string

  constructor() {
    this.consumerKey = process.env.USPS_CONSUMER_KEY || ''
    this.consumerSecret = process.env.USPS_CONSUMER_SECRET || ''

    this.api = axios.create({
      baseURL: 'https://secure.shippingapis.com',
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: this.consumerKey,
        password: this.consumerSecret,
      },
    })
  }

  /**
   * Verify address
   */
  async verifyAddress(address: USPSAddress): Promise<USPSVerifyResponse> {
    try {
      const response = await this.api.post('/ShippingAPI/v2/AddressValidation', {
        Address: {
          Address1: address.street,
          City: address.city,
          State: address.state,
          Zip5: address.zip,
        },
      })

      return {
        address,
        verified: response.data.Address.Valid === 'true',
        standardized: response.data.Address.Valid === 'true' ? {
          street: response.data.Address.Address1,
          city: response.data.Address.City,
          state: response.data.Address.State,
          zip: response.data.Address.Zip5,
        } : undefined,
      }
    } catch (error: any) {
      throw new Error(`USPS address verification error: ${error.message}`)
    }
  }

  /**
   * Get shipping rates
   */
  async getShippingRates(data: {
    from: USPSAddress
    to: USPSAddress
    weight: number
    service?: string
  }): Promise<any> {
    try {
      const response = await this.api.post('/ShippingAPI/v2/RateV4', {
        Package: {
          Service: data.service || 'PRIORITY',
          ZipOrigination: data.from.zip,
          ZipDestination: data.to.zip,
          Pounds: Math.floor(data.weight),
          Ounces: Math.round((data.weight % 1) * 16),
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(`USPS rate calculation error: ${error.message}`)
    }
  }

  /**
   * Track shipment
   */
  async trackShipment(trackingNumber: string): Promise<any> {
    try {
      const response = await this.api.post('/ShippingAPI/v2/TrackV2', {
        TrackID: {
          ID: trackingNumber,
        },
      })

      return response.data
    } catch (error: any) {
      throw new Error(`USPS tracking error: ${error.message}`)
    }
  }
}
