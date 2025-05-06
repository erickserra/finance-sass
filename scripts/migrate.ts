import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'src/database/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error during migrations:', error);
  }
};

main();
