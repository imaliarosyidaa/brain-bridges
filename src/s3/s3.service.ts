import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async getPresignedUrl(fileName: string, fileType: string, type: string) {
    const encodedFileName = encodeURIComponent(fileName);
    const key = `${type}/${uuidv4()}-${encodedFileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ACL: 'public-read',
      ContentType: fileType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 180 * 5 });
    return { url, key };
  }
}
