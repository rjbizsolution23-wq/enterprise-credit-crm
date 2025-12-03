/**
 * Twilio SMS Integration
 * RJ Business Solutions - Rick Jefferson
 */

import twilio from 'twilio'

export class TwilioService {
  private client: twilio.Twilio

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    const authToken = process.env.TWILIO_AUTH_TOKEN || ''

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured')
    }

    this.client = twilio(accountSid, authToken)
  }

  /**
   * Send SMS
   */
  async sendSMS(to: string, message: string, from?: string): Promise<any> {
    const fromNumber = from || process.env.TWILIO_PHONE_NUMBER || ''

    try {
      const result = await this.client.messages.create({
        body: message,
        to,
        from: fromNumber,
      })
      return result
    } catch (error: any) {
      throw new Error(`Twilio SMS Error: ${error.message}`)
    }
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(recipients: string[], message: string): Promise<any[]> {
    const results = await Promise.all(
      recipients.map((to) => this.sendSMS(to, message).catch((error) => ({ to, error })))
    )
    return results
  }

  /**
   * Verify phone number
   */
  async verifyPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      const lookup = await this.client.lookups.v1.phoneNumbers(phoneNumber).fetch()
      return !!lookup.phoneNumber
    } catch (error) {
      return false
    }
  }
}
