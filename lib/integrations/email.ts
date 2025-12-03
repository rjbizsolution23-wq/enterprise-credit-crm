/**
 * Email Service Integration (Nodemailer)
 * RJ Business Solutions - Rick Jefferson
 */

import nodemailer from 'nodemailer'

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  attachments?: Array<{
    filename: string
    path?: string
    content?: Buffer
  }>
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  /**
   * Send email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@rickjeffersonsolutions.com',
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      })
    } catch (error: any) {
      throw new Error(`Email send error: ${error.message}`)
    }
  }

  /**
   * Send dispute letter email
   */
  async sendDisputeLetter(
    to: string,
    clientName: string,
    disputeType: string,
    letterContent: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Your ${disputeType} Dispute Letter - RJ Business Solutions`,
      html: `
        <h2>Your Dispute Letter is Ready</h2>
        <p>Dear ${clientName},</p>
        <p>Your ${disputeType} dispute letter has been generated and is attached.</p>
        <p>Please review and mail it to the appropriate address.</p>
        <hr>
        <p><strong>RJ Business Solutions</strong><br>
        Rick Jefferson<br>
        1342 NM 333, Tijeras, New Mexico 87059<br>
        <a href="https://rickjeffersonsolutions.com">rickjeffersonsolutions.com</a></p>
      `,
      text: letterContent,
    })
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, clientName: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Welcome to RJ Business Solutions Credit Repair',
      html: `
        <h2>Welcome ${clientName}!</h2>
        <p>Thank you for choosing RJ Business Solutions for your credit repair needs.</p>
        <p>We're excited to help you on your journey to better credit.</p>
        <hr>
        <p><strong>RJ Business Solutions</strong><br>
        Rick Jefferson<br>
        1342 NM 333, Tijeras, New Mexico 87059<br>
        <a href="https://rickjeffersonsolutions.com">rickjeffersonsolutions.com</a></p>
      `,
    })
  }
}
