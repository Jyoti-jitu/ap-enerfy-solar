import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Neon Object Storage Client
 * Built for S3-compatible Neon buckets that branch with Lakebase Postgres.
 * Injected env vars: AWS_ENDPOINT_URL_S3, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 */

const DEFAULT_BUCKET = "uploads";

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    const endpoint = process.env.AWS_ENDPOINT_URL_S3;
    const region = process.env.AWS_REGION || "ap-southeast-1";
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

    s3ClientInstance = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      // Neon Object Storage requires path-style addressing
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
}

export function isNeonStorageConfigured(): boolean {
  return Boolean(
    process.env.AWS_ENDPOINT_URL_S3 &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );
}

export async function uploadObject({
  key,
  body,
  contentType = "application/octet-stream",
  bucket = DEFAULT_BUCKET,
}: {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  bucket?: string;
}) {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: typeof body === "string" ? Buffer.from(body) : body,
    ContentType: contentType,
  });

  const response = await client.send(command);
  return {
    key,
    bucket,
    eTag: response.ETag,
  };
}

export async function getObject({
  key,
  bucket = DEFAULT_BUCKET,
}: {
  key: string;
  bucket?: string;
}) {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const response = await client.send(command);
  const streamToBuffer = async (stream: any): Promise<Buffer> => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  };

  const buffer = await streamToBuffer(response.Body);
  return {
    key,
    bucket,
    contentType: response.ContentType,
    contentLength: response.ContentLength,
    buffer,
    text: buffer.toString("utf-8"),
  };
}

export async function getPresignedUrl({
  key,
  bucket = DEFAULT_BUCKET,
  expiresIn = 3600,
}: {
  key: string;
  bucket?: string;
  expiresIn?: number;
}) {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

export async function listObjects({
  prefix,
  bucket = DEFAULT_BUCKET,
  maxKeys = 100,
}: {
  prefix?: string;
  bucket?: string;
  maxKeys?: number;
} = {}) {
  const client = getS3Client();
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await client.send(command);
  return (response.Contents || []).map((item) => ({
    key: item.Key || "",
    size: item.Size || 0,
    lastModified: item.LastModified,
    eTag: item.ETag,
  }));
}

export async function deleteObject({
  key,
  bucket = DEFAULT_BUCKET,
}: {
  key: string;
  bucket?: string;
}) {
  const client = getS3Client();
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await client.send(command);
}
