"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ThemeVariant } from "./types";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function safeInt(n: unknown, fallback: number): number {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.trunc(x);
}

function pickRandom<T>(arr: T[]): T | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)] ?? null;
}

function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeCTA(text: string): string {
  const t = (text || "").trim();
  return t.length ? t : "Continue";
}

export default function CTAButton({
  ctaTexts,
  delayMinSec,
  delayMaxSec,
  redirectUrls,
  theme,
  subReadyText,
  subLockedPrefixText,
}: {
  ctaTexts: string[];
  delayMinSec: number;
  delayMaxSec: number;
  redirectUrls: string[];
  theme: ThemeVariant;
  subReadyText: string;
  subLockedPrefixText: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [ctaText, setCtaText] = useState<string>("Continue");
  const [ready, setReady] = useState(false);
  const [remaining, setRemaining] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [shake, setShake] = useState(false);

  // Refs untuk RAF-based countdown
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const totalMsRef = useRef<number>(0);

  const normalizedDelay = useMemo(() => {
    const min = clamp(safeInt(delayMinSec, 5), 0, 60);
    const max = clamp(safeInt(delayMaxSec, 10), 0, 60);
    if (max < min) return { min: max, max: min };
    return { min, max };
  }, [delayMinSec, delayMaxSec]);

  const effectiveRedirects = useMemo(() => {
    const urls = Array.isArray(redirectUrls) ? redirectUrls : [];
    return urls.filter(
      (u) => typeof u === "string" && isValidHttpUrl(u)
    );
  }, [redirectUrls]);

  // RAF loop — update progress dan remaining setiap frame
  const startRAF = useCallback((totalSec: number) => {
    if (totalSec <= 0) {
      setProgress(100);
      setRemaining(0);
      setReady(true);
      return;
    }

    totalMsRef.current = totalSec * 1000;
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const totalMs = totalMsRef.current;

      // Progress 0→100 smooth
      const pct = clamp((elapsed / totalMs) * 100, 0, 100);
      setProgress(pct);

      // Remaining detik (ceiling agar countdown tampil natural)
      const remainSec = Math.ceil((totalMs - elapsed) / 1000);
      setRemaining(clamp(remainSec, 0, totalSec));

      if (elapsed >= totalMs) {
        setProgress(100);
        setRemaining(0);
        setReady(true);
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Init sekali saat mount
  useEffect(() => {
    setMounted(true);

    const texts = (Array.isArray(ctaTexts) ? ctaTexts : [])
      .map((x) => (typeof x === "string" ? x.trim() : ""))
      .filter(Boolean);

    const picked = pickRandom(texts);
    setCtaText(normalizeCTA(String(picked ?? "Continue")));

    const { min, max } = normalizedDelay;
    const secs =
      min === max ? min : Math.floor(min + Math.random() * (max - min + 1));

    setRemaining(secs);
    setProgress(0);
    startRAF(secs);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sizeClass = useMemo(() => {
    const len = (ctaText || "").length;
    if (len <= 8) return "cta--short";
    if (len <= 12) return "cta--medium";
    return "cta--long";
  }, [ctaText]);

  const aria = ready
    ? ctaText
    : `${subLockedPrefixText} ${remaining} seconds`;

  const handleClick = useCallback(() => {
    if (!ready) return;

    const picked = pickRandom(effectiveRedirects);
    if (picked && isValidHttpUrl(picked)) {
      window.location.assign(picked);
      return;
    }

    // Tidak ada URL valid — shake + re-lock singkat
    setShake(true);
    setTimeout(() => setShake(false), 450);
    setReady(false);
    setProgress(0);
    startRAF(2);
  }, [ready, effectiveRedirects, startRAF]);

  if (!mounted) return null;

  return (
    <div className="ctaWrap" aria-live="polite">
      <button
        type="button"
        className={[
          "cta",
          `cta--${theme}`,
          sizeClass,
          ready ? "cta--ready" : "cta--locked",
          shake ? "cta--shake" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={handleClick}
        disabled={!ready}
        aria-label={aria}
      >
        <span className="cta__content">
          <span className="cta__text">{ctaText}</span>
          <span className="cta__sub" aria-hidden="true">
            {ready
              ? subReadyText
              : `${subLockedPrefixText} ${remaining}s`}
          </span>
        </span>

        <span className="cta__icon" aria-hidden="true">
          <span className="arrow" />
        </span>

        <span className="cta__sheen" aria-hidden="true" />
        <span className="cta__ring" aria-hidden="true" />
      </button>

      {!ready && (
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className={`progress__bar progress__bar--${theme}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

