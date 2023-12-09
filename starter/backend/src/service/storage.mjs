import AWSXRay from 'aws-xray-sdk-core'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'

import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('service:s3')

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

class Storage {
  constructor() {
    this.s3Client = AWSXRay.captureAWSv3Client(new S3Client())
  }

  async deleteObject(todoId) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: todoId
    })
  
    try {
      const response = await this.s3Client.send(command)
      logger.info(`Delete object ${JSON.stringify(response)}`)
    } catch (err) {
      logger.error(`Delete object error : ${err}`)
    }
  }

  async getUploadUrl(todoId) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: todoId
    })
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: urlExpiration
    })
    return url
  }

  getAttachmentUrl(todoId) {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
}

export const storage = new Storage();
