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
  heroBadgeText: "Preview",
  heroStatusText: "Unlocking soon",
  heroTitleText: "One quick step",
  heroSubtitleVariants: [
    "Fast preview before you continue — clean, smooth, distraction-free.",
  ],
  chipAText: "Instant load",
  chipBText: "Soft motion",
  chipCText: "Premium feel",
  ctaHintText: "Tap when ready to continue.",
  ctaMetaText: "Secure handoff",
  ctaSubReadyText: "Tap to continue",
  ctaSubLockedPrefixText: "Unlocking in",
  ctaFineprintText:
    "By continuing, you'll be redirected to the next page. This short preview helps keep the experience smooth.",
  loadingText: "Loading…",
  adLabelTop: "Sponsored",
  adLabelBottom: "Sponsored",
  adLabelLeft: "Sponsored",
  adLabelRight: "Sponsored",
};

const HEADERS = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "paragraph.json");
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

