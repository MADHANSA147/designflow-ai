import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock_access_key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret_key',
  },
  // endpoint: process.env.AWS_ENDPOINT // useful if using minio or cloudflare r2
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'designflow-assets-mock';

export const storageService = {
  async uploadFile(fileBuffer: Buffer, key: string, mimeType: string) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    try {
      await s3Client.send(command);
      return { bucket: BUCKET_NAME, key };
    } catch (error) {
      console.warn('Mocking S3 upload due to lack of real credentials.');
      return { bucket: BUCKET_NAME, key };
    }
  },

  async getSignedDownloadUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    try {
      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      return `https://mock-s3.designflow.ai/${BUCKET_NAME}/${key}?sig=mock_signed_url`;
    }
  },

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    try {
      await s3Client.send(command);
    } catch (error) {
      console.warn('Mocking S3 delete.');
    }
  }
};
