import * as schema from 'drizzle/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
	url: process.env.TURSO_DB_URL as string,
	authToken: process.env.TURSO_DB_AUTH_TOKEN as string
});

const db = drizzle(client, { schema });

export { db };
