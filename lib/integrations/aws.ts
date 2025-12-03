/**
 * AWS S3 Storage Integration
 * RJ Business Solutions - Rick Jefferson
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class AWSStorageService {
  private s3: S3Client
  private bucket: string

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    })

    this.bucket = process.env.AWS_S3_BUCKET || ''
  }

  /**
   * Upload file
   */
  async uploadFile(
    key: string,
    file: Buffer | string,
    contentType?: string
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      })

      await this.s3.send(command)
      return `https://${this.bucket}.s3.amazonaws.com/${key}`
    } catch (error: any) {
      throw new Error(`S3 upload error: ${error.message}`)
    }
  }

  /**
   * Get file URL
   */
  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    return await getSignedUrl(this.s3, command, { expiresIn })
  }

  /**
   * Delete file
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })

      await this.s3.send(command)
    } catch (error: any) {
      throw new Error(`S3 delete error: ${error.message}`)
    }
  }
}
