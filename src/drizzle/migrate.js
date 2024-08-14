const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { config } = require('dotenv');

config();

console.log(process.env.DATABASE_URL);

const pool = new Pool({
	user: 'postgres.zqxqbceqanuyqniwjtqs',
	password: 'ehWMvfPT#7JKdXg',
	host: 'aws-0-eu-central-1.pooler.supabase.com',
	port: 6543,
	database: 'postgres'
});

const db = drizzle(pool);

async function main() {
	console.log('migration started...');

	await migrate(db, { migrationsFolder: 'drizzle' });

	console.log('migration successful!');

	process.exit(0);
}

main().catch((err) => {
	console.log(err);
	process.exit(0);
});
