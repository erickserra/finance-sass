import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL! as string;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: DATABASE_URL,
  },
});
