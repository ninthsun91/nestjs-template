export function env() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    deployEnv: process.env.DEPLOY_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      url: process.env.DATABASE_URL || '',
    },
  }
}
