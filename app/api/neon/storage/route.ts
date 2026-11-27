import { NextRequest, NextResponse } from "next/server";
import {
  uploadObject,
  listObjects,
  getPresignedUrl,
  isNeonStorageConfigured,
} from "@/lib/neon-storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isNeonStorageConfigured()) {
    return NextResponse.json(
      { error: "Neon Object Storage is not configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") || undefined;
  const key = searchParams.get("key");

  try {
    if (key) {
      const presignedUrl = await getPresignedUrl({ key, expiresIn: 3600 });
      return NextResponse.json({ key, presignedUrl });
    }

    const items = await listObjects({ prefix });
    return NextResponse.json({
      bucket: "uploads",
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to query storage" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isNeonStorageConfigured()) {
    return NextResponse.json(
      { error: "Neon Object Storage is not configured" },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "documents";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${Date.now()}-${sanitizedName}`;

    const uploaded = await uploadObject({
      key,
      body: buffer,
      contentType: file.type || "application/octet-stream",
    });

    const presignedUrl = await getPresignedUrl({ key, expiresIn: 86400 });

    return NextResponse.json({
      success: true,
      key: uploaded.key,
      bucket: uploaded.bucket,
      fileName: file.name,
      size: file.size,
      contentType: file.type,
      url: presignedUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to upload file to Neon Object Storage" },
      { status: 500 }
    );
  }
}
