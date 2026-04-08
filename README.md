# Next.js Pre-Landing Ads v2.0

Ultra-lightweight, mobile-first, high-conversion pre-landing page.
Built with Next.js 15 App Router + TypeScript.
Zero heavy frameworks. Single config file. Production-ready.

---

## 📋 Tech Stack

- **Next.js** 15.2.3 (App Router)
- **React** 19.0.0
- **TypeScript** 5.4.5
- **PM2** 6.x (process manager)
- **Node.js** v24.x
- **npm** v11.x
- **OS** Debian 13
- **Reverse Proxy** OpenLiteSpeed

---

## 📁 Struktur Project

```
nextjs-prelanding-ads/
├── app/
│   ├── api/
│   │   ├── backgrounds/
│   │   │   └── route.ts        ← API list background images
│   │   ├── config/
│   │   │   └── route.ts        ← API serve config.json
│   │   └── paragraph/
│   │       └── route.ts        ← API serve paragraph.json
│   ├── error.tsx               ← Global error boundary
│   ├── layout.tsx              ← Root layout + metadata (title tab browser)
│   ├── page.tsx                ← Entry point halaman
│   └── robots.ts               ← noindex/nofollow
├── components/
│   ├── AdSlot.tsx              ← Wrapper banner dengan label Sponsored
│   ├── Background.tsx          ← Background animated + static image
│   ├── BannerSlot.tsx          ← Safe non-blocking script injector
│   ├── CTAButton.tsx           ← Tombol CTA dengan delay + redirect
│   ├── FallbackHero.tsx        ← Hero UI saat banner kosong
│   ├── Prelander.tsx           ← Main orchestrator component
│   └── types.ts                ← TypeScript types
├── data/
│   ├── config.json             ← ⚙️ KONFIGURASI UTAMA
│   └── paragraph.json          ← 📝 SEMUA TEKS HALAMAN
├── public/
│   └── backgrounds/            ← Letakkan bg001.jpg, bg002.webp dst
├── styles/
│   └── globals.css             ← Global styles + 6 theme variants
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚙️ Konfigurasi — `data/config.json`

```json
{
  "ctaTexts": [
    "Read More",
    "Continue",
    "Open Now",
    "Discover",
    "View Details",
    "See More"
  ],
  "delay": {
    "min": 5,
    "max": 10
  },
  "redirectUrls": [
    "https://tujuan1.com",
    "https://tujuan2.com",
    "https://tujuan3.com"
  ],
  "banners": {
    "top": "",
    "bottom": "",
    "left": "",
    "right": ""
  },
  "themes": {
    "randomize": true,
    "enabled": ["aurora", "sunset", "ocean", "neon", "candy", "mono"]
  },
  "backgrounds": {
    "mode": "auto",
    "useStaticImages": true,
    "publicDir": "backgrounds",
    "preferPrefix": "bg",
    "allowedExtensions": ["jpg", "jpeg", "png", "webp", "avif", "gif"]
  }
}
```

| Key | Fungsi |
|---|---|
| `ctaTexts` | Array label tombol CTA — dipilih random setiap load |
| `delay.min` / `delay.max` | Range delay detik sebelum CTA aktif (0–60) |
| `redirectUrls` | Pool URL tujuan — dipilih random saat CTA diklik |
| `banners.top/bottom/left/right` | Paste script iklan di sini |
| `themes.randomize` | `true` = tema random per session |
| `themes.enabled` | Pilih dari: aurora, sunset, ocean, neon, candy, mono |
| `backgrounds.mode` | `auto` \| `static` \| `off` |
| `backgrounds.useStaticImages` | `true` = load gambar dari `/public/backgrounds/` |

> ✅ **Edit config.json tidak perlu rebuild** — cukup refresh browser.

---

## 📝 Teks Halaman — `data/paragraph.json`

```json
{
  "heroBadgeText": "Preview",
  "heroStatusText": "Unlocking soon",
  "heroTitleText": "One quick step",
  "heroSubtitleVariants": [
    "Fast preview before you continue.",
    "A quick step to keep the experience snappy.",
    "Short wait, then continue with a smoother handoff.",
    "Minimal friction. Modern UI. Built for speed."
  ],
  "chipAText": "Instant load",
  "chipBText": "Soft motion",
  "chipCText": "Premium feel",
  "ctaHintText": "Tap when ready to continue.",
  "ctaMetaText": "Secure handoff",
  "ctaSubReadyText": "Tap to continue",
  "ctaSubLockedPrefixText": "Unlocking in",
  "ctaFineprintText": "By continuing, you'll be redirected to the next page.",
  "loadingText": "Loading…",
  "adLabelTop": "Sponsored",
  "adLabelBottom": "Sponsored",
  "adLabelLeft": "Sponsored",
  "adLabelRight": "Sponsored"
}
```

| Key | Posisi di Halaman |
|---|---|
| `heroBadgeText` | Badge kecil kiri atas |
| `heroStatusText` | Badge kanan atas dengan animasi pulse |
| `heroTitleText` | Judul utama H1 |
| `heroSubtitleVariants` | Subjudul — dipilih random setiap load |
| `chipAText/B/C` | 3 feature chip di bawah subjudul |
| `ctaHintText` | Teks kecil di atas tombol |
| `ctaMetaText` | Badge keamanan di sebelah hint |
| `ctaSubReadyText` | Sub-label tombol saat aktif |
| `ctaSubLockedPrefixText` | Sub-label tombol saat countdown |
| `ctaFineprintText` | Disclaimer di bawah tombol |
| `loadingText` | Teks saat halaman loading |

> ✅ **Edit paragraph.json tidak perlu rebuild** — cukup refresh browser.

---

## 🏷️ Ubah Title Tab Browser

Edit `app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Nama Website Kamu",
  description: "Deskripsi singkat",
  ...
};
```

> ⚠️ **Perlu rebuild** setelah edit file `.tsx`

---

## 🖼️ Tambah Background Image

Letakkan file di:
```
public/backgrounds/bg001.jpg
public/backgrounds/bg002.webp
public/backgrounds/bg003.png
```

Format didukung: `jpg`, `jpeg`, `png`, `webp`, `avif`, `gif`

Sistem akan auto-detect dan memilih satu secara random per session.
Jika folder kosong → animated gradient background otomatis aktif.

---

## 🚀 Instalasi & Menjalankan

### Pertama Kali

```bash
# Clone / copy project ke server
cd ~/prelanding-ads

# Install dependencies
npm install

# Build production
npm run build

# Test manual (opsional)
npm run start
# Akses → http://IP:3100
# Ctrl+C kalau sudah OK
```

### Setup PM2 (Production)

```bash
# Start via PM2
pm2 start "npm run start" --name prelanding-ads

# Cek status
pm2 status

# Setup auto-start saat reboot
pm2 startup
# ⚠️ Copy paste command yang muncul di terminal, lalu jalankan

# Simpan snapshot
pm2 save
```

### Verifikasi Setelah Reboot

```bash
reboot
# setelah nyala:
pm2 status
# prelanding-ads → online ✅
```

---

## 🌐 Koneksi ke OpenLiteSpeed (Reverse Proxy)

### Arsitektur

```
User → OLS (172.16.103.253:80) → Next.js (172.16.103.200:3100)
```

### Test Koneksi Antar Server

```bash
# Dari server OLS
curl http://172.16.103.200:3100/
# Harus return HTML ✅
```

### Konfigurasi di OLS WebAdmin (`https://172.16.103.253:7080`)

**1. Buat Virtual Host**
```
Virtual Hosts → Add
Name      : prelanding
Root      : /var/www/prelanding/
```

**2. Tambah External App**
```
Virtual Hosts → prelanding → External Apps → Add
Type    : Web Server
Name    : nextjs_app
Address : 172.16.103.200:3100
```

**3. Tambah Context**
```
Virtual Hosts → prelanding → Context → Add
Type        : Proxy
URI         : /
Web Server  : nextjs_app
```

**4. Tambah Listener**
```
Listeners → Add
Name    : prelanding_http
Port    : 80
Secure  : No
```

**5. Bind Listener ke Virtual Host**
```
Listeners → prelanding_http → Virtual Host Mappings → Add
Virtual Host : prelanding
```

**6. Graceful Restart OLS**
```bash
/usr/local/lsws/bin/lswsctrl restart
```

---

## 📦 Deploy Update

```bash
# Update teks/config saja (tanpa rebuild)
# Edit data/config.json atau data/paragraph.json
# → Langsung refresh browser, selesai ✅

# Update code (.tsx/.ts) — perlu rebuild
cd ~/prelanding-ads
npm run build && pm2 restart prelanding-ads
```

---

## 🛠️ PM2 Cheatsheet

```bash
pm2 status                   # cek status semua app
pm2 logs prelanding-ads      # log realtime
pm2 restart prelanding-ads   # restart
pm2 stop prelanding-ads      # stop
pm2 reload prelanding-ads    # graceful reload (zero downtime)
pm2 save                     # simpan snapshot
```

---

## 🧠 Cara Kerja

### Delay System
1. Saat page load, delay random dipilih antara `delay.min` dan `delay.max`
2. CTA disabled dengan countdown `Unlocking in Xs`
3. Progress bar mengisi seiring waktu
4. Saat 0 → CTA aktif dengan animasi breathing pulse

### Redirect System
1. Saat CTA diklik, satu URL dipilih random dari `redirectUrls`
2. URL divalidasi dengan `new URL()` — harus `http:` atau `https:`
3. Redirect via `window.location.assign()`
4. Jika array kosong/invalid → tombol shake + re-lock singkat, tidak crash

### Banner Injection
1. Script dibaca dari `config.json`
2. Diinjeksi non-blocking via `requestIdleCallback`
3. Di-parse aman dengan `DOMParser`
4. External script → `async defer`
5. Gagal injeksi → silent fail, halaman tetap jalan

### Theme System
- 6 tema: `aurora`, `sunset`, `ocean`, `neon`, `candy`, `mono`
- Dipilih random sekali per session → disimpan di `sessionStorage`
- Setiap tema punya CSS variable palette sendiri

### Background System
- Image diletakkan di `public/backgrounds/`
- API route `/api/backgrounds` auto-list semua file valid
- Satu dipilih random per session → disimpan di `sessionStorage`
- Jika kosong → animated gradient otomatis

---

## ✅ Production Checklist

```
☐ Isi redirectUrls dengan URL tujuan nyata
☐ Sesuaikan ctaTexts dengan niche/offer
☐ Set delay.min dan delay.max
☐ Edit paragraph.json sesuai konten
☐ Ganti title di app/layout.tsx
☐ Paste kode iklan ke banners (opsional)
☐ Drop background images ke public/backgrounds/ (opsional)
☐ npm run build
☐ pm2 start → pm2 save → pm2 startup
☐ Setup reverse proxy di OLS
☐ Test akses dari browser
```

---

**Stack:** Next.js 15 · React 19 · TypeScript · PM2 · Debian 13 · OpenLiteSpeed

