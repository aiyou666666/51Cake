module.exports = {
  apps: [
    {
      name: '51Cake',
      script: 'build/main.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: 'root',
      host: '101.200.55.70', // 服务器IP
      ref: 'origin/master',
      repo: 'git@github.com:aiyou666666/51Cake.git',
      path: '/opt/www/51Cake',
      'post-deploy': 'npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
}
