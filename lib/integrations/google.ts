/**
 * Google Services Integration
 * Google AI, Gemini, Drive, Workspace
 * RJ Business Solutions - Rick Jefferson
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { google } from 'googleapis'

export class GoogleAIService {
  private genAI: GoogleGenerativeAI

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('Google AI API key not configured')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  /**
   * Generate content with Gemini
   */
  async generateContent(prompt: string, model: string = 'gemini-pro'): Promise<string> {
    try {
      const modelInstance = this.genAI.getGenerativeModel({ model })
      const result = await modelInstance.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error: any) {
      throw new Error(`Google AI error: ${error.message}`)
    }
  }
}

export class GoogleDriveService {
  private drive: any

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GDRIVE_CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/drive'],
    })

    this.drive = google.drive({ version: 'v3', auth })
  }

  /**
   * Upload file to Google Drive
   */
  async uploadFile(fileName: string, fileContent: Buffer, mimeType: string): Promise<string> {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
        },
        media: {
          mimeType,
          body: fileContent,
        },
      })

      return response.data.id || ''
    } catch (error: any) {
      throw new Error(`Google Drive upload error: ${error.message}`)
    }
  }

  /**
   * Get file from Google Drive
   */
  async getFile(fileId: string): Promise<Buffer> {
    try {
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      )
      return Buffer.from(response.data as ArrayBuffer)
    } catch (error: any) {
      throw new Error(`Google Drive get file error: ${error.message}`)
    }
  }
}
