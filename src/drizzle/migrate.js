const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');

const pool = new Pool({
	connectionString: 'postgresql://postgres:test12345@localhost:5432/fiicode'
});

const db = drizzle(pool);

async function main() {
	console.log('migration started...');

	await migrate(db, { migrationsFolder: 'drizzle' });

	console.log('migration ended...');

	process.exit(0);
}

main().catch((err) => {
	console.log(err);
	process.exit(0);
});
