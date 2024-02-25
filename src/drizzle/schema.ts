import {
	boolean,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('User', {
	id: serial('id').primaryKey(),
	firstName: varchar('firstName', { length: 30 }),
	lastName: varchar('lastName', { length: 30 }),
	user: varchar('user', { length: 30 }).unique(),
	password: varchar('password'),
	email: varchar('email').unique(),
	admin: boolean('admin').default(false)
});

export const usersRelations = relations(users, ({ one, many }) => ({
	preferences: one(preferences),
	reviews: many(reviews),
	submissions: many(submissions)
}));

export const preferences = pgTable('Restriction', {
	id: serial('id').primaryKey(),
	userID: integer('userID').references(() => users.id),
	data: jsonb('data')
});

export const products = pgTable('Product', {
	id: serial('id').primaryKey(),
	ean: integer('ean'),
	upVotes: integer('upVotes'),
	downVotes: integer('downVotes')
});

export const productsRelations = relations(products, ({ one }) => ({
	details: one(productDetails)
}));

export const productDetails = pgTable('ProductDetails', {
	id: serial('id').primaryKey(),
	productID: integer('productID').references(() => products.id),
	details: jsonb('details')
});

export const reviews = pgTable('Review', {
	id: serial('id').primaryKey(),
	body: text('body'),
	value: integer('value'),
	authorID: integer('authorID')
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
	author: one(users, {
		fields: [reviews.authorID],
		references: [users.id]
	})
}));

export const submissions = pgTable('Submission', {
	id: serial('id').primaryKey(),
	body: jsonb('body'),
	authorID: integer('authorID'),
	status: varchar('status', { enum: ['pending', 'approved', 'rejected'] })
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
	author: one(users, {
		fields: [submissions.authorID],
		references: [users.id]
	})
}));
