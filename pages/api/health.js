// pages/api/health.js - Simple health check endpoint
// Used by cron health-check.js (every 6h) and external monitors.
// Returns 200 if the site is alive; delegates to system-status for richer data.

export default async function handler(req, res) {
  try {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'iseeiape.com'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
