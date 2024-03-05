import type { Config } from 'drizzle-kit';

export default {
	schema: './src/drizzle/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: 'postgresql://postgres:test12345@localhost:5432/fiicode'
	}
} satisfies Config;
