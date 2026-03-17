module.exports = {
  apps: [
    {
      name: 'iseeiape-automation',
      script: './scripts/cron-manager.js',
      args: 'start',
      cwd: '/home/matrix/.openclaw/workspace/iseeiape-website',
      interpreter: 'node',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        NODE_PATH: '/home/matrix/.npm-global/lib/node_modules'
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/automation-error.log',
      out_file: './logs/automation-out.log',
      combine_logs: true,
      
      // Process management
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      
      // Monitoring
      watch: false,
      ignore_watch: [
        'node_modules',
        'logs',
        '.next',
        'backups',
        'neo-crypto/outputs'
      ],
      
      // Auto-restart
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Cron jobs will run within this process
      cron_restart: '0 3 * * *', // Daily restart at 3 AM
      
      // Environment specific
      env_production: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'iseeiape-website',
      script: 'npm',
      args: 'start',
      cwd: '/home/matrix/.openclaw/workspace/iseeiape-website',
      interpreter: 'none',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/website-error.log',
      out_file: './logs/website-out.log',
      
      // Process management
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1G',
      
      // Monitoring
      watch: false,
      ignore_watch: [
        'node_modules',
        'logs',
        '.next',
        'backups',
        'neo-crypto'
      ],
      
      // Auto-restart
      autorestart: true,
      restart_delay: 10000,
      max_restarts: 5,
      min_uptime: '30s',
      
      // Environment specific
      env_production: {
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      }
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'matrix',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:iseeiape/iseeiape-website.git',
      path: '/home/matrix/.openclaw/workspace/iseeiape-website',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};