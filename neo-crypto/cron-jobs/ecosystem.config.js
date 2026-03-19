module.exports = {
  apps: [
    {
      name: 'iseeiape-cron',
      script: '/home/matrix/.openclaw/workspace/iseeiape-website/scripts/cron-manager.js',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/matrix/.openclaw/workspace/iseeiape-website/neo-crypto/logs/cron-error.log',
      out_file: '/home/matrix/.openclaw/workspace/iseeiape-website/neo-crypto/logs/cron-out.log',
      log_file: '/home/matrix/.openclaw/workspace/iseeiape-website/neo-crypto/logs/cron-combined.log',
      time: true
    }
  ]
};
