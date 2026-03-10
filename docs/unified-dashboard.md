# Unified Market Dashboard - Documentation

## Overview

The Unified Market Dashboard combines Wolf Alerts (micro-cap, high-conviction signals) with Enhanced Market Data (established tokens, narratives, whale activity) into a single, powerful interface for crypto market intelligence.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐
│   Wolf Alerts   │    │ Enhanced Market  │
│   (Micro-caps)  │    │   Data (Estab.)  │
└────────┬────────┘    └────────┬─────────┘
         │                      │
         └──────────┬───────────┘
                    │
           ┌────────▼────────┐
           │ Unified Market  │
           │   Data API      │
           └────────┬────────┘
                    │
           ┌────────▼────────┐
           │ Enhanced        │
           │ Dashboard UI    │
           └─────────────────┘
```

## Features

### 1. **Unified Data API** (`/api/unified-market-data.js`)
- Combines Wolf Alerts and Enhanced Market Data
- Intelligent deduplication (prefers Wolf Alerts for micro-caps)
- Unified scoring system
- Comprehensive error handling with fallbacks
- CORS enabled for cross-origin requests

### 2. **Enhanced Dashboard UI** (`/dashboard-enhanced`)
- **Data Source Filtering**: Toggle between All/Wolf/Enhanced views
- **Token Cards**: Real-time metrics with color-coded performance
- **Market Narratives**: Trending themes and sentiment
- **Whale Activity**: Recent large wallet movements
- **Market Overview**: Key statistics at a glance
- **Responsive Design**: Mobile-friendly interface

### 3. **Data Sources**

#### Wolf Alerts
- **Type**: Micro-cap tokens
- **Focus**: High-conviction, early-stage opportunities
- **Scoring**: 0-100 based on volume, momentum, liquidity
- **Signals**: Custom indicators for each token

#### Enhanced Market Data
- **Type**: Established tokens
- **Focus**: Market leaders, high-volume pairs
- **Data**: Price, volume, liquidity, narratives
- **Whale Tracking**: Large wallet activity

## API Endpoints

### Primary Endpoint
```
GET /api/unified-market-data
```

### Response Format
```json
{
  "success": true,
  "data": {
    "tokens": [...],           // Combined token list
    "narratives": [...],       // Market narratives
    "whaleActivity": [...],    // Recent whale moves
    "marketOverview": {...},   // Statistics
    "metadata": {...}          // Source info
  }
}
```

### Fallback Endpoints
If unified API fails, dashboard falls back to:
- `/api/market-data` (Wolf Alerts only)
- `/api/enhanced-market-data` (Enhanced data only)

## Installation & Setup

### 1. Prerequisites
- Node.js 16+
- Next.js 13+
- Existing Wolf Alerts data pipeline
- Enhanced Market Data fetcher running

### 2. File Structure
```
iseeiape-website/
├── pages/
│   ├── api/
│   │   └── unified-market-data.js    # Unified API
│   └── dashboard-enhanced.tsx         # Enhanced UI
├── components/
│   └── Layout.tsx                     # Updated navigation
└── docs/
    └── unified-dashboard.md           # This documentation
```

### 3. Data Files Required
- `data/wolf-alerts-latest.json` - Wolf Alerts data
- `neo-crypto/data/enhanced-live-data.json` - Enhanced market data

## Usage

### Accessing the Dashboard
1. Navigate to `/dashboard-enhanced`
2. Use tabs to filter data sources:
   - **All**: Combined view (default)
   - **Wolf**: Micro-cap opportunities only
   - **Enhanced**: Established tokens only

### Interpreting the Data

#### Token Cards
- **Score**: 0-100 (higher = better signal)
- **24h Change**: Color-coded (green = up, red = down)
- **Volume**: Trading volume in last 24 hours
- **Signals**: Key indicators for each token

#### Market Narratives
- **Score**: 0-100 narrative strength
- **Tokens**: Top performers in this narrative
- **Description**: Brief explanation

#### Whale Activity
- **Type**: Buy/Sell/Transfer
- **Token**: Which token was moved
- **Value**: Estimated USD value
- **Wallet**: Anonymized wallet address

## Development

### Adding New Data Sources
1. Update `unified-market-data.js` to fetch new source
2. Add transformation logic in API
3. Update UI to display new data type
4. Add filtering option if needed

### Customizing Scoring
Edit the scoring functions in `unified-market-data.js`:
- `calculateEnhancedTokenScore()` - For established tokens
- Wolf Alerts already has built-in scoring

### Styling Customization
CSS is inline in `dashboard-enhanced.tsx`. Key classes:
- `.card` - Token cards
- `.narrative-card` - Narrative items
- `.whale-activity` - Whale move items
- `.stat-card` - Statistics cards

## Performance Considerations

### Caching
- API responses are not cached by default
- Consider adding Redis or similar for production
- Client-side caching via localStorage possible

### Rate Limiting
- Wolf Alerts API may have rate limits
- Enhanced data fetcher has built-in rate limiting
- Consider adding API gateway for production

### Data Freshness
- Dashboard refreshes every 30 seconds
- Data files updated by cron jobs (typically 5-15 minute intervals)
- Real-time updates possible with WebSockets

## Troubleshooting

### Common Issues

#### 1. No Data Showing
- Check if data files exist
- Verify API endpoints are accessible
- Check browser console for errors

#### 2. Slow Loading
- Reduce number of tokens displayed
- Implement pagination for large datasets
- Add loading states for better UX

#### 3. Styling Issues
- Check CSS specificity conflicts
- Verify responsive breakpoints
- Test on multiple browsers

#### 4. API Errors
- Check CORS headers
- Verify data file permissions
- Review error logs in console

### Debug Mode
Add `?debug=true` to URL for console logging:
```javascript
// In dashboard-enhanced.tsx
if (router.query.debug) {
  console.log('Market Data:', marketData);
}
```

## Future Enhancements

### Planned Features
1. **WebSocket Integration** - Real-time updates
2. **Portfolio Tracking** - Connect user wallets
3. **Alert System** - Push notifications
4. **Backtesting** - Historical performance
5. **Social Sentiment** - Twitter/Reddit integration

### Technical Improvements
1. **TypeScript Migration** - Full type safety
2. **Unit Tests** - Comprehensive testing
3. **Performance Monitoring** - Analytics dashboard
4. **CDN Integration** - Faster asset delivery

## Contributing

### Code Standards
- Use TypeScript for new components
- Follow existing naming conventions
- Add comments for complex logic
- Update documentation when changing APIs

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit PR with detailed description
5. Await review and merge

## Support

### Getting Help
- Check this documentation first
- Review existing issues on GitHub
- Contact development team

### Reporting Issues
1. Check if issue already exists
2. Create detailed bug report:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

## License & Credits

### License
Proprietary - Part of iseeiape crypto intelligence platform

### Credits
- **Wolf Alerts**: Original micro-cap detection system
- **Enhanced Data**: Advanced market analytics pipeline
- **Dashboard UI**: Matrix Army design system
- **Integration**: Neo (AI Agent)

### Version History
- **v1.0** (2026-03-11): Initial release with unified data system
- **Future**: Planned enhancements and features

---
*Documentation last updated: March 11, 2026*  
*Maintained by: Matrix Army Automation Team*