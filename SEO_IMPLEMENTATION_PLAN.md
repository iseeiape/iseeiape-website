# 🦎 iseeiape.com SEO/GEO Implementation Plan

## Status Tracker

### 1. ✅ Schema Markup
- [ ] Homepage (WebApplication + Organization + WebSite)
- [ ] Article pages (Article schema)
- [ ] BreadcrumbList (all inner pages)

### 2. ✅ Meta Tags
- [ ] Global defaults (_app.js)
- [ ] Homepage specific
- [ ] Dynamic per-article

### 3. ✅ Sitemap
- [ ] Dynamic pages/sitemap.xml.js

### 4. ✅ robots.txt
- [ ] Update with LLM crawlers

### 5. ✅ llms.txt
- [ ] Create public/llms.txt

### 6. ✅ Performance
- [ ] Update next.config.js

---

## Implementation Order:
1. next.config.js (foundation)
2. _app.js (global meta)
3. _document.js (lang attribute)
4. Homepage schema
5. Article schema component
6. Sitemap
7. robots.txt
8. llms.txt
9. Update all article pages

**Estimated time: 30-45 minutes** ⏱️
