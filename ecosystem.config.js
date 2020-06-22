module.exports = {
  apps: [
    {
      name: 'pm2DotenvServer',
      script: './src/server.ts',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
