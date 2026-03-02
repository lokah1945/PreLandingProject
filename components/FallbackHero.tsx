"use client";

import React, { useMemo } from "react";
import type { NormalizedParagraphs, ThemeVariant } from "./types";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function safeText(v: unknown, fallback: string): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : fallback;
}

function safeVariants(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);
}

export default function FallbackHero({
  theme,
  p,
}: {
  theme: ThemeVariant;
  p: NormalizedParagraphs;
}) {
  const subtitle = useMemo(() => {
    const variants = safeVariants(p.heroSubtitleVariants);
    if (variants.length === 0)
      return "Fast preview before you continue — clean, smooth, distraction-free.";
    return pickRandom(variants);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chips = useMemo(() => {
    const a = safeText(p.chipAText, "Instant load");
    const b = safeText(p.chipBText, "Soft motion");
    const c = safeText(p.chipCText, "Premium feel");
    return [a, b, c].filter(Boolean);
  }, [p.chipAText, p.chipBText, p.chipCText]);

  return (
    <section
      className={`hero hero--${theme}`}
      aria-label="Pre-landing hero"
    >
      <div className="hero__top">
        <div className="badge" aria-hidden="true">
          <span className="badge__dot" />
          <span className="badge__text">
            {safeText(p.heroBadgeText, "Preview")}
          </span>
        </div>

        <div className="status" aria-hidden="true">
          <span className="status__pulse" />
          <span className="status__text">
            {safeText(p.heroStatusText, "Unlocking soon")}
          </span>
        </div>
      </div>

      <h1 className="hero__title">
        {safeText(p.heroTitleText, "One quick step")}
      </h1>
      <p className="hero__subtitle">{subtitle}</p>

      <div className="hero__chips" aria-label="Highlights">
        {chips.map((c) => (
          <span className="chip" key={c}>
            {c}
          </span>
        ))}
      </div>

      <div className="hero__divider" aria-hidden="true" />
    </section>
  );
}

