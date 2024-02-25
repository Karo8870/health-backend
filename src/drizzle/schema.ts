import { integer, jsonb, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('User', {
	id: serial('id').primaryKey(),
	firstName: varchar('firstName', { length: 30 }),
	lastName: varchar('lastName', { length: 30 }),
	user: varchar('user', { length: 30 }).unique(),
	password: varchar('password'),
	email: varchar('email').unique()
});

export const usersRelations = relations(users, ({ one }) => ({
	restrictions: one(restrictions)
}));

export const restrictions = pgTable('Restriction', {
	id: serial('id').primaryKey(),
	userID: integer('userID').references(() => users.id),
	data: jsonb('data')
});

export const products = pgTable('Product', {
	id: serial('id').primaryKey(),
	code: integer('code')
});
