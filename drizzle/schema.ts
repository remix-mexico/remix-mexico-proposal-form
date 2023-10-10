import { sql } from 'drizzle-orm';
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';

export const proposals = sqliteTable(
	'proposals',
	{
		id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
		ownerEmail: text('owner_email').notNull().unique(),
		ownerName: text('owner_name').notNull(),
		title: text('title').notNull(),
		description: text('description', { length: 250 }),
		read: integer('read', { mode: 'boolean' }).notNull().default(false),
		createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
	},
	t => {
		return {
			idIdx: uniqueIndex('id_idx').on(t.id),
			ownerEmailIdx: uniqueIndex('owner_email_idx').on(t.ownerEmail),
			readIndex: index('read_idx').on(t.read),
			createdAtIndex: index('created_at_idx').on(t.createdAt)
		};
	}
);
