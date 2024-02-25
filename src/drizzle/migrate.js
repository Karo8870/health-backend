const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { config } = require('dotenv');

config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
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
