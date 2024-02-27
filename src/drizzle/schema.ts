import {
	bigint,
	boolean,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
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
	reviews: many(posts),
	submissions: many(submissions),
	comments: many(comments),
	productReviews: many(productReviews),
	postReviews: many(postReviews)
}));

export const preferences = pgTable('Restriction', {
	id: serial('id').primaryKey(),
	userID: integer('userID').references(() => users.id),
	data: jsonb('data')
});

export const productDetails = pgTable('ProductDetails', {
	id: serial('id').primaryKey(),
	ean: bigint('ean', { mode: 'number' }).unique(),
	data: jsonb('data')
});

export const productReviews = pgTable('ProductReview', {
	id: serial('id').primaryKey(),
	like: boolean('like'),
	userID: integer('userID').references(() => users.id),
	productEAN: bigint('productEAN', { mode: 'number' })
});

export const posts = pgTable('Post', {
	id: serial('id').primaryKey(),
	body: text('body'),
	date: timestamp('date').defaultNow(),
	productEAN: bigint('productEAN', { mode: 'number' }),
	authorID: integer('authorID').references(() => users.id)
});

export const postReviews = pgTable('PostReview', {
	id: serial('id').primaryKey(),
	like: boolean('like'),
	userID: integer('userID').references(() => users.id),
	postID: integer('postID').references(() => posts.id)
});

export const postsRelations = relations(posts, ({ many }) => ({
	comments: many(comments),
	reviews: many(postReviews)
}));

export const comments = pgTable('Comment', {
	id: serial('id').primaryKey(),
	body: text('body'),
	date: timestamp('date').defaultNow(),
	postID: integer('postID').references(() => posts.id),
	authorID: integer('authorID').references(() => users.id)
});

export const submissions = pgTable('Submission', {
	id: serial('id').primaryKey(),
	body: jsonb('body'),
	status: varchar('status', { enum: ['pending', 'processed'] }),
	date: timestamp('date').defaultNow(),
	productEAN: bigint('productEAN', { mode: 'number' }),
	authorID: integer('authorID').references(() => users.id)
});
