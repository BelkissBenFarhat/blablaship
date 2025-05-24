// Environment configuration for deployment
export const config = {
  // Server configuration
  port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Session configuration
  sessionSecret: process.env.SESSION_SECRET || 'blablaship-dev-secret',
  
  // Database configuration (for PostgreSQL in production)
  databaseUrl: process.env.DATABASE_URL,
  
  // CORS settings
  corsOrigins: process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',') : 
    ['http://localhost:3000', 'http://localhost:5000']
};