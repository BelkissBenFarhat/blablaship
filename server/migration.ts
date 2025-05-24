import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { config } from './config';

// This script runs database migrations for PostgreSQL
// It can be used to set up the database schema when deploying to a production environment

async function runMigrations() {
  if (!config.databaseUrl) {
    console.error('No DATABASE_URL environment variable found. Cannot run migrations.');
    process.exit(1);
  }

  console.log('Running database migrations...');
  
  try {
    const sql = neon(config.databaseUrl);
    const db = drizzle(sql);
    
    // This will create tables based on your schema
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations();