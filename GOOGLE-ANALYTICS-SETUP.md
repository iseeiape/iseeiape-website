# Google Analytics Setup for iseeiape.com

## Current Status
GA tracking code is added to `_app.tsx` but needs your Measurement ID.

## Step 1: Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or access your existing property
4. Create a new property for "iseeiape.com"
5. Follow setup wizard:
   - Property name: iseeiape
   - Timezone: Europe/Bucharest
   - Currency: USD
6. Choose "Web" as platform
7. Enter website URL: https://www.iseeiape.com
8. Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`)

## Step 2: Update the Code

Replace the placeholder in `pages/_app.tsx`:

```typescript
// OLD (placeholder):
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'

// NEW (your actual ID):
const GA_MEASUREMENT_ID = 'G-ABC123DEF456'
```

## Step 3: Deploy

```bash
git add -A
git commit -m "Add Google Analytics tracking"
git push origin main
```

## What Gets Tracked

- Page views (automatic)
- User sessions
- Traffic sources
- Device types
- Geographic locations
- Page load times

## Verify It's Working

1. Deploy to production
2. Visit your site
3. Go to Google Analytics → Real-time
4. You should see active users

## Alternative: Use Vercel Analytics

If you prefer, Vercel has built-in analytics:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select iseeiape-website project
3. Click "Analytics" tab
4. Enable (free tier available)

## Privacy Note

Make sure to add a privacy policy if you're tracking users from EU (GDPR compliance).

---

**Current placeholder:** `G-XXXXXXXXXX`  
**Status:** Code ready, needs your ID
