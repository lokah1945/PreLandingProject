"use client";

import React, { useMemo } from "react";
import BannerSlot from "./BannerSlot";

function safeLabel(v: unknown, fallback: string): string {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : fallback;
}

export default function AdSlot({
  position,
  code,
  label,
}: {
  position: "top" | "bottom" | "left" | "right";
  code: string;
  label: string;
}) {
  const normalized = useMemo(
    () => (typeof code === "string" ? code.trim() : ""),
    [code]
  );

  if (!normalized) return null;

  return (
    <section
      className={`adSlot adSlot--${position}`}
      aria-label={`${position} ad`}
    >
      <div className="adSlot__label" aria-hidden="true">
        {safeLabel(label, "Sponsored")}
      </div>
      <div className="adSlot__box">
        <BannerSlot code={normalized} />
      </div>
    </section>
  );
}

