import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

const FALLBACK = {
  ctaTexts: ["Continue", "Discover", "View Details"],
  delay: { min: 5, max: 10 },
  redirectUrls: [],
  banners: { top: "", bottom: "", left: "", right: "" },
  themes: {
    randomize: true,
    enabled: ["aurora", "sunset", "ocean", "neon", "candy", "mono"],
  },
  backgrounds: {
    mode: "auto",
    useStaticImages: true,
    publicDir: "backgrounds",
    preferPrefix: "bg",
    allowedExtensions: ["jpg", "jpeg", "png", "webp", "avif", "gif"],
  },
};

const HEADERS = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "config.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = safeJsonParse(raw);

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json(FALLBACK, { status: 200, headers: HEADERS });
    }

    return NextResponse.json(parsed, { status: 200, headers: HEADERS });
  } catch {
    return NextResponse.json(FALLBACK, { status: 200, headers: HEADERS });
  }
}

