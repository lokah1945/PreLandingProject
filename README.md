# Next.js Pre-Landing Ads v2.0

Ultra-lightweight, mobile-first, high-conversion pre-landing page.
Built with Next.js 15 App Router + TypeScript.
Zero heavy frameworks. One config file. Production-ready.

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

**Production:**
```bash
npm run build
npm start
```

---

## Edit Behavior → `data/config.json`

| Key | What it controls |
|---|---|
| `ctaTexts` | Array of CTA label variants (random pick per load) |
| `delay.min` / `delay.max` | Unlock delay range in seconds (clamped 0–60) |
| `redirectUrls` | Destination URL pool (random pick on click) |
| `banners.top/bottom/left/right` | Paste ad script/HTML strings here |
| `themes.randomize` | true = random theme per session |
| `themes.enabled` | Which themes to use: aurora/sunset/ocean/neon/candy/mono |
| `backgrounds.mode` | `auto` \| `static` \| `off` |
| `backgrounds.useStaticImages` | true = try loading from /public/backgrounds/ |

---

## Edit All Text → `data/paragraph.json`

All on-page copy is controlled here:
- Hero badge, status, title, subtitle variants
- Feature chips (A/B/C)
- CTA hint, meta badge, sub-label, fineprint
- Loading text
- Sponsored labels per ad position

---

## Add Background Images

Drop files into:
```
public/backgrounds/bg001.jpg
public/backgrounds/bg002.webp
public/backgrounds/bg003.png
```

Supported: `jpg`, `jpeg`, `png`, `webp`, `avif`, `gif`

The `/api/backgrounds` route auto-lists them. One is picked randomly per session and persisted in `sessionStorage`.

If the folder is empty or missing, the animated gradient background is used automatically.

---

## How It Works

### Delay Logic
1. On mount, a random delay is picked between `delay.min` and `delay.max`
2. CTA is disabled with a live countdown (`Unlocking in Xs`)
3. Progress bar fills as time passes
4. At 0, the CTA animates to active state with breathing pulse

### Redirect Logic
1. On CTA click, one URL is picked randomly from `redirectUrls`
2. URL is validated with `new URL()` — must be `http:` or `https:`
3. Redirects via `window.location.assign()`
4. If the array is empty or invalid, the button shakes and briefly re-locks (no crash)

### Banner Injection
1. Scripts read from `config.json` banners
2. Injected non-blocking via `requestIdleCallback` → `setTimeout` fallback
3. Parsed safely with `DOMParser`
4. External `<script src>` appended with `async defer`
5. Inline scripts appended as new `<script>` nodes
6. Silent failure — never crashes the page

### Theme System
- 6 themes: `aurora`, `sunset`, `ocean`, `neon`, `candy`, `mono`
- Each theme has its own CSS variable palette (glows, gradients, progress colors)
- Theme is randomized once per session and saved to `sessionStorage`

---

## Deploy

Any Node.js platform that supports Next.js:
```bash
npm run build
npm start
```

Or deploy to **Vercel** (zero config):
```bash
npx vercel --prod
```

