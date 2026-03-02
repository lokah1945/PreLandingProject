"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdSlot from "./AdSlot";
import Background from "./Background";
import CTAButton from "./CTAButton";
import FallbackHero from "./FallbackHero";
import type {
  Config,
  NormalizedConfig,
  NormalizedParagraphs,
  Paragraphs,
  ThemeVariant,
} from "./types";

// ─── Safe helpers ────────────────────────────────────────────────────────────

function safeArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function safeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function safeNumber(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function safeBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

const ALLOWED_THEMES: ThemeVariant[] = [
  "aurora",
  "sunset",
  "ocean",
  "neon",
  "candy",
  "mono",
];

function safeThemeArray(v: unknown): ThemeVariant[] {
  if (!Array.isArray(v)) return ALLOWED_THEMES;
  const filtered = v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((x): x is ThemeVariant =>
      (ALLOWED_THEMES as string[]).includes(x)
    );
  return filtered.length ? filtered : ALLOWED_THEMES;
}

// ─── Config normalizer ───────────────────────────────────────────────────────

function normalizeConfig(raw: unknown): NormalizedConfig {
  const cfg = (raw ?? {}) as Partial<Config>;

  const ctaTexts = safeArray(cfg.ctaTexts)
    .map((x) => safeString(x).trim())
    .filter(Boolean);

  const delayMinSec = safeNumber(cfg.delay?.min, 5);
  const delayMaxSec = safeNumber(cfg.delay?.max, 10);

  const redirectUrls = safeArray(cfg.redirectUrls)
    .map((x) => safeString(x).trim())
    .filter(Boolean);

  const banners = {
    top: safeString(cfg.banners?.top),
    bottom: safeString(cfg.banners?.bottom),
    left: safeString(cfg.banners?.left),
    right: safeString(cfg.banners?.right),
  };

  const themesEnabled = safeThemeArray(cfg.themes?.enabled);
  const themesRandomize = safeBool(cfg.themes?.randomize, true);

  const bgModeRaw = safeString(cfg.backgrounds?.mode).trim();
  const mode: "auto" | "static" | "off" =
    bgModeRaw === "static" || bgModeRaw === "off" || bgModeRaw === "auto"
      ? bgModeRaw
      : "auto";

  const useStaticImages = safeBool(cfg.backgrounds?.useStaticImages, true);
  const publicDir =
    safeString(cfg.backgrounds?.publicDir).trim() || "backgrounds";
  const preferPrefix =
    safeString(cfg.backgrounds?.preferPrefix).trim() || "bg";
  const rawExts = safeArray(cfg.backgrounds?.allowedExtensions)
    .map((x) => safeString(x).trim().toLowerCase())
    .filter(Boolean);
  const allowedExtensions = rawExts.length
    ? rawExts
    : ["jpg", "jpeg", "png", "webp", "avif", "gif"];

  return {
    ctaTexts: ctaTexts.length ? ctaTexts : ["Continue"],
    delayMinSec,
    delayMaxSec,
    redirectUrls,
    banners,
    themes: { randomize: themesRandomize, enabled: themesEnabled },
    backgrounds: {
      mode,
      useStaticImages,
      publicDir,
      preferPrefix,
      allowedExtensions,
    },
  };
}

// ─── Paragraph normalizer ────────────────────────────────────────────────────

const FALLBACK_PARAGRAPH: NormalizedParagraphs = {
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

function normalizeParagraph(raw: unknown): NormalizedParagraphs {
  const p = (raw ?? {}) as Partial<Paragraphs>;

  const s = (v: unknown, fb: string): string => {
    const x = typeof v === "string" ? v.trim() : "";
    return x.length ? x : fb;
  };

  const variants = Array.isArray(p.heroSubtitleVariants)
    ? p.heroSubtitleVariants
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter(Boolean)
    : [];

  return {
    heroBadgeText: s(p.heroBadgeText, FALLBACK_PARAGRAPH.heroBadgeText),
    heroStatusText: s(p.heroStatusText, FALLBACK_PARAGRAPH.heroStatusText),
    heroTitleText: s(p.heroTitleText, FALLBACK_PARAGRAPH.heroTitleText),
    heroSubtitleVariants: variants.length
      ? variants
      : FALLBACK_PARAGRAPH.heroSubtitleVariants,
    chipAText: s(p.chipAText, FALLBACK_PARAGRAPH.chipAText),
    chipBText: s(p.chipBText, FALLBACK_PARAGRAPH.chipBText),
    chipCText: s(p.chipCText, FALLBACK_PARAGRAPH.chipCText),
    ctaHintText: s(p.ctaHintText, FALLBACK_PARAGRAPH.ctaHintText),
    ctaMetaText: s(p.ctaMetaText, FALLBACK_PARAGRAPH.ctaMetaText),
    ctaSubReadyText: s(p.ctaSubReadyText, FALLBACK_PARAGRAPH.ctaSubReadyText),
    ctaSubLockedPrefixText: s(
      p.ctaSubLockedPrefixText,
      FALLBACK_PARAGRAPH.ctaSubLockedPrefixText
    ),
    ctaFineprintText: s(
      p.ctaFineprintText,
      FALLBACK_PARAGRAPH.ctaFineprintText
    ),
    loadingText: s(p.loadingText, FALLBACK_PARAGRAPH.loadingText),
    adLabelTop: s(p.adLabelTop, FALLBACK_PARAGRAPH.adLabelTop),
    adLabelBottom: s(p.adLabelBottom, FALLBACK_PARAGRAPH.adLabelBottom),
    adLabelLeft: s(p.adLabelLeft, FALLBACK_PARAGRAPH.adLabelLeft),
    adLabelRight: s(p.adLabelRight, FALLBACK_PARAGRAPH.adLabelRight),
  };
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function allBannersEmpty(banners: NormalizedConfig["banners"]): boolean {
  return (
    !banners.top.trim() &&
    !banners.bottom.trim() &&
    !banners.left.trim() &&
    !banners.right.trim()
  );
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function setSession(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage unavailable — proceed without persistence
  }
}

// ─── Prelander ───────────────────────────────────────────────────────────────

export default function Prelander() {
  const [config, setConfig] = useState<NormalizedConfig | null>(null);
  const [p, setP] = useState<NormalizedParagraphs>(FALLBACK_PARAGRAPH);
  const [theme, setTheme] = useState<ThemeVariant>("aurora");
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      try {
        const [cfgRes, pRes] = await Promise.all([
          fetch("/api/config", { cache: "no-store" }),
          fetch("/api/paragraph", { cache: "no-store" }),
        ]);

        const cfgJson = cfgRes.ok ? await cfgRes.json() : null;
        const pJson = pRes.ok ? await pRes.json() : null;

        if (cancelled) return;

        const normalizedCfg = normalizeConfig(cfgJson);
        setConfig(normalizedCfg);
        setP(normalizeParagraph(pJson));

        // ── Theme selection (persisted per session) ──────────────────────
        const themeKey = "pl_theme_v1";
        const savedTheme = getSession(themeKey);
        const enabledThemes = normalizedCfg.themes.enabled;

        if (savedTheme && (enabledThemes as string[]).includes(savedTheme)) {
          setTheme(savedTheme as ThemeVariant);
        } else {
          const t = normalizedCfg.themes.randomize
            ? randomPick(enabledThemes)
            : enabledThemes[0];
          setTheme(t);
          setSession(themeKey, t);
        }

        // ── Background image selection (persisted per session) ───────────
        const bgKey = "pl_bg_v1";
        const savedBg = getSession(bgKey);

        const { mode, useStaticImages } = normalizedCfg.backgrounds;

        if (mode === "off" || !useStaticImages) {
          setBgUrl(null);
        } else if (savedBg) {
          setBgUrl(savedBg);
        } else if (mode === "auto" || mode === "static") {
          try {
            const bgRes = await fetch("/api/backgrounds", {
              cache: "no-store",
            });
            const list = bgRes.ok ? ((await bgRes.json()) as unknown) : null;
            const arr = Array.isArray(list) ? list : [];
            const urls = arr.filter(
              (x): x is string =>
                typeof x === "string" && x.startsWith("/")
            );

            if (urls.length) {
              const picked = randomPick(urls);
              setBgUrl(picked);
              setSession(bgKey, picked);
            } else {
              setBgUrl(null);
            }
          } catch {
            setBgUrl(null);
          }
        } else {
          setBgUrl(null);
        }
      } catch {
        if (cancelled) return;

        // Hard fallback — never crash
        setConfig(
          normalizeConfig({
            ctaTexts: ["Continue", "Discover", "View Details"],
            delay: { min: 5, max: 10 },
            redirectUrls: [],
            banners: { top: "", bottom: "", left: "", right: "" },
            themes: { randomize: true, enabled: ALLOWED_THEMES },
            backgrounds: {
              mode: "auto",
              useStaticImages: true,
              publicDir: "backgrounds",
              preferPrefix: "bg",
            },
          })
        );
        setP(FALLBACK_PARAGRAPH);
        setTheme("aurora");
        setBgUrl(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasBanners = useMemo(
    () => (config ? !allBannersEmpty(config.banners) : false),
    [config]
  );

  const adLabels = useMemo(
    () => ({
      top: p.adLabelTop,
      bottom: p.adLabelBottom,
      left: p.adLabelLeft,
      right: p.adLabelRight,
    }),
    [p.adLabelTop, p.adLabelBottom, p.adLabelLeft, p.adLabelRight]
  );

  return (
    <main className={`shell theme--${theme}`} suppressHydrationWarning>
      <Background theme={theme} imageUrl={bgUrl} />

      <div className="frame">
        {config ? (
          <>
            <AdSlot
              position="top"
              code={config.banners.top}
              label={adLabels.top}
            />
            <AdSlot
              position="bottom"
              code={config.banners.bottom}
              label={adLabels.bottom}
            />
            <AdSlot
              position="left"
              code={config.banners.left}
              label={adLabels.left}
            />
            <AdSlot
              position="right"
              code={config.banners.right}
              label={adLabels.right}
            />
          </>
        ) : null}

        <section className="card" aria-label="Pre-landing content">
          <div className="card__rim" aria-hidden="true" />
          <div className="card__inner">
            {!ready ? (
              <div className="loading" aria-label="Loading">
                <div className="loading__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="loading__text">{p.loadingText}</span>
              </div>
            ) : (
              <>
                {!hasBanners ? (
                  <FallbackHero theme={theme} p={p} />
                ) : (
                  <div className="bannerModeHeader" aria-hidden="true" />
                )}

                <div className="ctaArea">
                  <div className="ctaArea__row">
                    <p className="ctaArea__hint">{p.ctaHintText}</p>
                    <span className="ctaArea__meta" aria-hidden="true">
                      {p.ctaMetaText}
                    </span>
                  </div>

                  <CTAButton
                    ctaTexts={config?.ctaTexts ?? ["Continue"]}
                    delayMinSec={config?.delayMinSec ?? 5}
                    delayMaxSec={config?.delayMaxSec ?? 10}
                    redirectUrls={config?.redirectUrls ?? []}
                    theme={theme}
                    subReadyText={p.ctaSubReadyText}
                    subLockedPrefixText={p.ctaSubLockedPrefixText}
                  />

                  <p className="fineprint">{p.ctaFineprintText}</p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

