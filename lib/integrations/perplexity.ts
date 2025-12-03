/**
 * Perplexity AI Integration
 * Real-time research and information
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class PerplexityService {
  private api: AxiosInstance

  constructor() {
    const apiKey = process.env.PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY_2

    this.api = axios.create({
      baseURL: 'https://api.perplexity.ai',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Research credit repair topic
   */
  async research(query: string): Promise<any> {
    try {
      const response = await this.api.post('/chat/completions', {
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a credit repair research assistant. Provide accurate, up-to-date information.',
          },
          {
            role: 'user',
            content: query,
          },
        ],
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Perplexity research error: ${error.message}`)
    }
  }

  /**
   * Get latest FCRA updates
   */
  async getFCRAUpdates(): Promise<string> {
    const response = await this.research('Latest FCRA regulations and updates for credit repair businesses')
    return response.choices[0]?.message?.content || ''
  }

  /**
   * Research credit bureau policies
   */
  async researchBureauPolicy(bureau: 'TransUnion' | 'Equifax' | 'Experian'): Promise<string> {
    const response = await this.research(`Current ${bureau} dispute policies and procedures`)
    return response.choices[0]?.message?.content || ''
  }
}

