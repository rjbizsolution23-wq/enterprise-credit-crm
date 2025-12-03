/**
 * Cloudflare Integration
 * CDN, Workers, R2 Storage
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export class CloudflareService {
  private api: AxiosInstance
  private accountId: string
  private zoneId: string

  constructor() {
    const token = process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_TOKEN_2
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || ''
    this.zoneId = process.env.CLOUDFLARE_ZONE_ID || process.env.CLOUDFLARE_ZONE_ID_2 || ''

    this.api = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Purge cache
   */
  async purgeCache(files?: string[]): Promise<void> {
    try {
      await this.api.post(`/zones/${this.zoneId}/purge_cache`, {
        files,
        purge_everything: !files || files.length === 0,
      })
    } catch (error: any) {
      throw new Error(`Cloudflare purge cache error: ${error.message}`)
    }
  }

  /**
   * Upload to R2
   */
  async uploadToR2(bucket: string, key: string, file: Buffer): Promise<void> {
    // R2 uses S3-compatible API
    // Implementation would use AWS SDK with Cloudflare R2 endpoint
    throw new Error('R2 upload not yet implemented - use AWS S3 service with R2 endpoint')
  }
}
