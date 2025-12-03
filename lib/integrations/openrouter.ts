/**
 * OpenRouter Integration
 * Multi-model AI routing
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class OpenRouterService {
  private api: AxiosInstance

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY_2 || process.env.OPENROUTER_API_KEY_3

    this.api = axios.create({
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://rickjeffersonsolutions.com',
        'X-Title': 'RJ Business Solutions Credit CRM',
      },
    })
  }

  /**
   * Chat completion with model selection
   */
  async chatCompletion(model: string, messages: any[], options?: any): Promise<any> {
    try {
      const response = await this.api.post('/chat/completions', {
        model,
        messages,
        ...options,
      })
      return response.data
    } catch (error: any) {
      throw new Error(`OpenRouter error: ${error.message}`)
    }
  }

  /**
   * Use Claude for reasoning tasks
   */
  async claudeChat(messages: any[]): Promise<string> {
    const response = await this.chatCompletion('anthropic/claude-3.5-sonnet', messages)
    return response.choices[0]?.message?.content || ''
  }

  /**
   * Use GPT-4 for general tasks
   */
  async gpt4Chat(messages: any[]): Promise<string> {
    const response = await this.chatCompletion('openai/gpt-4-turbo', messages)
    return response.choices[0]?.message?.content || ''
  }

  /**
   * Use DeepSeek for coding tasks
   */
  async deepseekChat(messages: any[]): Promise<string> {
    const response = await this.chatCompletion('deepseek/deepseek-coder', messages)
    return response.choices[0]?.message?.content || ''
  }
}
