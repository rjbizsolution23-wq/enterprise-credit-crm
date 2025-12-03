/**
 * Stripe Payment Integration
 * RJ Business Solutions - Rick Jefferson
 */

import Stripe from 'stripe'

export class StripeService {
  private stripe: Stripe

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('Stripe secret key not configured')
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-11-20.acacia',
    })
  }

  /**
   * Create customer
   */
  async createCustomer(data: {
    email: string
    name: string
    phone?: string
    metadata?: Record<string, string>
  }): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      metadata: data.metadata,
    })
  }

  /**
   * Create subscription
   */
  async createSubscription(data: {
    customerId: string
    priceId: string
    metadata?: Record<string, string>
  }): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.create({
      customer: data.customerId,
      items: [{ price: data.priceId }],
      metadata: data.metadata,
    })
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(data: {
    amount: number
    currency?: string
    customerId?: string
    metadata?: Record<string, string>
  }): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency || 'usd',
      customer: data.customerId,
      metadata: data.metadata,
    })
  }

  /**
   * Create invoice
   */
  async createInvoice(data: {
    customerId: string
    amount: number
    description: string
    metadata?: Record<string, string>
  }): Promise<Stripe.Invoice> {
    return await this.stripe.invoices.create({
      customer: data.customerId,
      amount: data.amount,
      currency: 'usd',
      description: data.description,
      metadata: data.metadata,
    })
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    return await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    })
  }
}
