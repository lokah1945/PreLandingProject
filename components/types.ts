export type ThemeVariant =
  | "aurora"
  | "sunset"
  | "ocean"
  | "neon"
  | "candy"
  | "mono";

export type Config = {
  ctaTexts: string[];
  delay: { min: number; max: number };
  redirectUrls: string[];
  banners: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  themes?: {
    randomize?: boolean;
    enabled?: ThemeVariant[];
  };
  backgrounds?: {
    mode?: "auto" | "static" | "off";
    useStaticImages?: boolean;
    publicDir?: string;
    preferPrefix?: string;
    allowedExtensions?: string[];
  };
};

export type NormalizedConfig = {
  ctaTexts: string[];
  delayMinSec: number;
  delayMaxSec: number;
  redirectUrls: string[];
  banners: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  themes: {
    randomize: boolean;
    enabled: ThemeVariant[];
  };
  backgrounds: {
    mode: "auto" | "static" | "off";
    useStaticImages: boolean;
    publicDir: string;
    preferPrefix: string;
    allowedExtensions: string[];
  };
};

export type Paragraphs = {
  heroBadgeText: string;
  heroStatusText: string;
  heroTitleText: string;
  heroSubtitleVariants: string[];
  chipAText: string;
  chipBText: string;
  chipCText: string;
  ctaHintText: string;
  ctaMetaText: string;
  ctaSubReadyText: string;
  ctaSubLockedPrefixText: string;
  ctaFineprintText: string;
  loadingText: string;
  adLabelTop: string;
  adLabelBottom: string;
  adLabelLeft: string;
  adLabelRight: string;
};

export type NormalizedParagraphs = Paragraphs;

