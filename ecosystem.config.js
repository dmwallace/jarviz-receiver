module.exports = {
  apps : [{
    name: 'jarviz-receiver',
    script: './src/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    "post_update": ["npm install", "echo launching the app"],
    instances: 1,
    autorestart: true,
    watch: false,
    versioning: {
      repo_path: "C:\\jarviz-receiver\\"
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
