import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const ALLOWED_EXT = new Set([
  "jpg", "jpeg", "png", "webp", "avif", "gif",
]);

const HEADERS = { "Cache-Control": "no-store" };

function isSafeFilename(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name);
}

function hasAllowedExt(file: string): boolean {
  const i = file.lastIndexOf(".");
  if (i === -1) return false;
  return ALLOWED_EXT.has(file.slice(i + 1).toLowerCase());
}

function scoreName(name: string): number {
  const m = name.match(/^bg(\d{3,})\./i);
  if (m) return 100000 + Number(m[1] ?? 0);
  return 0;
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public", "backgrounds");

    if (
      !fs.existsSync(publicDir) ||
      !fs.statSync(publicDir).isDirectory()
    ) {
      return NextResponse.json([], { status: 200, headers: HEADERS });
    }

    const files = fs
      .readdirSync(publicDir)
      .filter(isSafeFilename)
      .filter(hasAllowedExt)
      .sort((a, b) => {
        const sa = scoreName(a);
        const sb = scoreName(b);
        if (sa !== sb) return sb - sa;
        return a.localeCompare(b);
      })
      .map((f) => `/backgrounds/${f}`);

    return NextResponse.json(files, { status: 200, headers: HEADERS });
  } catch {
    return NextResponse.json([], { status: 200, headers: HEADERS });
  }
}

