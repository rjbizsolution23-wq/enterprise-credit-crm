/**
 * SendGrid Email Integration (Alternative to Nodemailer)
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class SendGridService {
  private api: AxiosInstance
  private fromEmail: string

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY
    if (!apiKey) {
      throw new Error('SendGrid API key not configured')
    }

    this.api = axios.create({
      baseURL: 'https://api.sendgrid.com/v3',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@rickjeffersonsolutions.com'
  }

  /**
   * Send email
   */
  async sendEmail(data: {
    to: string | string[]
    subject: string
    html?: string
    text?: string
    attachments?: Array<{
      content: string
      filename: string
      type?: string
    }>
  }): Promise<void> {
    try {
      await this.api.post('/mail/send', {
        personalizations: [
          {
            to: Array.isArray(data.to)
              ? data.to.map((email) => ({ email }))
              : [{ email: data.to }],
            subject: data.subject,
          },
        ],
        from: { email: this.fromEmail },
        content: [
          ...(data.html ? [{ type: 'text/html', value: data.html }] : []),
          ...(data.text ? [{ type: 'text/plain', value: data.text }] : []),
        ],
        attachments: data.attachments,
      })
    } catch (error: any) {
      throw new Error(`SendGrid send email error: ${error.message}`)
    }
  }
}

