# iseeiape Trending Tokens Website

## 🚀 Quick Start

### 1. Test Locally
```bash
cd ~/iseeiape-website
npm run dev
```
Visit: http://localhost:3000/trending

### 2. Deploy to Vercel

**Option A: Vercel Website**
1. Go to https://vercel.com/new
2. Import this folder: `~/iseeiape-website`
3. Add environment variables:
   - `CIELO_API_KEY`: 93771acc-c2fc-455d-b8e7-263ccd61da4a
   - `NEXT_PUBLIC_CIELO_REF`: https://app.cielo.finance/r/iseeiape
4. Deploy!

**Option B: Vercel CLI**
```bash
cd ~/iseeiape-website
vercel --prod
```

## 📁 Files

- `src/app/trending/page.tsx` - Trending tokens page
- `src/app/api/trending/route.ts` - API route for Cielo data
- `.env.local` - Environment variables

## 🎯 Features

- 6 different trending views (volume, mindshare, smart money, etc.)
- Real-time data from Cielo Finance
- All token clicks use YOUR ref link
- Auto-refresh every 2 minutes
- Mobile responsive

## 🔗 Cielo Ref

All clicks go to: `https://app.cielo.finance/r/iseeiape`
