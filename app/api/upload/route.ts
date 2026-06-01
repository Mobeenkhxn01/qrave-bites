import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/heic", // optional (iPhone)
  "image/heif", // optional
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file") as File | null;

    // 🔍 debug log (remove later)
    console.log("Upload file:", file?.name, file?.type, file?.size);

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const s3 = new S3Client({
      region: process.env.MOBEEN_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.MOBEEN_AWS_ACCESS_KEY!,
        secretAccessKey: process.env.MOBEEN_AWS_SECRET_KEY!,
      },
    });

    const ext = file.name.split(".").pop();
    const key = `${uniqid()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = process.env.MOBEEN_AWS_BUCKET_NAME!;

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      })
    );

    const url = `https://${bucket}.s3.${process.env.MOBEEN_AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}