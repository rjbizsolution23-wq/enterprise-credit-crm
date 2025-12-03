/**
 * OpenAI Integration
 * For AI-powered features in CRM
 * RJ Business Solutions - Rick Jefferson
 */

import OpenAI from 'openai'

export class OpenAIService {
  private client: OpenAI

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    this.client = new OpenAI({ apiKey })
  }

  /**
   * Generate client communication
   */
  async generateClientMessage(context: string, type: 'email' | 'sms' | 'letter'): Promise<string> {
    const prompt = `Generate a professional ${type} message for a credit repair client based on this context: ${context}`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional credit repair specialist assistant. Generate clear, helpful, and compliant communications.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || ''
  }

  /**
   * Analyze credit report
   */
  async analyzeCreditReport(reportData: any): Promise<any> {
    const prompt = `Analyze this credit report data and provide insights, recommendations, and action items: ${JSON.stringify(reportData)}`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a credit repair expert. Analyze credit reports and provide actionable recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
    })

    return JSON.parse(response.choices[0]?.message?.content || '{}')
  }

  /**
   * Generate dispute letter content
   */
  async generateDisputeLetterContent(disputeData: any): Promise<string> {
    const prompt = `Generate a professional FCRA-compliant dispute letter for: ${JSON.stringify(disputeData)}`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert specializing in FCRA compliance. Generate professional dispute letters.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    return response.choices[0]?.message?.content || ''
  }
}

