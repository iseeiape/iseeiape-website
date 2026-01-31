# 🚀 iseeiape Quick Deploy Guide

## Option 1: Vercel Website (Easiest - 2 minutes)

1. **Download the project:**
   ```bash
   scp -r dan@YOUR_SERVER:~/iseeiape-website ~/Downloads/
   ```

2. **Go to:** https://vercel.com/new

3. **Click "Import Project" → "Import Git Repository"**
   OR drag & drop the `iseeiape-website` folder

4. **Add Environment Variables:**
   ```
   CIELO_API_KEY=93771acc-c2fc-455d-b8e7-263ccd61da4a
   NEXT_PUBLIC_CIELO_REF=https://app.cielo.finance/r/iseeiape
   ```

5. **Deploy!** 🎉

---

## Option 2: Vercel CLI (Fast - 1 minute)

On your local machine:

```bash
# 1. Download project
scp -r dan@YOUR_SERVER:~/iseeiape-website ~/Downloads/
cd ~/Downloads/iseeiape-website

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login & Deploy
vercel login --token=vck_0XUNuYivaugC6pcSr9gwEJWQu4ggu51K9p6uadumSppnA7i81J4fqnZb
vercel --prod
```

---

## Option 3: GitHub + Vercel (Best for updates)

1. **Create GitHub repo** (iseeiape-website)
2. **Push the code:**
   ```bash
   cd ~/iseeiape-website
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/iseeiape-website.git
   git push -u origin main
   ```
3. **Go to Vercel → Import GitHub repo**
4. **Add env vars (same as above)**
5. **Deploy!**

---

## ✅ After Deploy

Your site will be live at:
- `https://iseeiape-xyz.vercel.app` (or your custom domain)

**Pages:**
- `/` → Landing page
- `/trending` → Trending tokens

**All token clicks use YOUR Cielo ref!** 💰

---

## 🆘 Troubleshooting

### Build fails?
- Check that env vars are set
- Check Vercel build logs

### API not working?
- Verify `CIELO_API_KEY` is correct
- Check that `.env.local` was uploaded

### 404 errors?
- Make sure `next.config.ts` has `output: 'export'`
- Redeploy

---

**Good luck! 🚀🦞**
