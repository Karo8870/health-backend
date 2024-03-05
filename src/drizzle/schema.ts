import {
	boolean,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
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
	preferences: one(preferences, {
		fields: [users.id],
		references: [preferences.userID]
	}),
	reviews: many(posts),
	submissions: many(submissions),
	comments: many(comments),
	productReviews: many(productReviews),
	postReviews: many(postReviews),
	posts: many(posts, {
		relationName: 'ownPosts'
	})
}));

export const preferences = pgTable('Restriction', {
	id: serial('id').primaryKey(),
	userID: integer('userID').references(() => users.id, { onDelete: 'cascade' }),
	data: jsonb('data')
});

export const productDetails = pgTable('ProductDetails', {
	id: serial('id').primaryKey(),
	ean: varchar('ean', { length: 15 }).unique(),
	data: jsonb('data')
});

export const productReviews = pgTable(
	'ProductReview',
	{
		id: serial('id').primaryKey(),
		like: boolean('like'),
		userID: integer('userID').references(() => users.id, {
			onDelete: 'cascade'
		}),
		productEAN: varchar('productEAN', { length: 15 })
	},
	(table) => ({
		unq: unique().on(table.userID, table.productEAN)
	})
);

export const productRelations = relations(productReviews, ({ one }) => ({
	author: one(users, {
		fields: [productReviews.userID],
		references: [users.id]
	})
}));


export const posts = pgTable('Post', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 100 }),
	date: timestamp('date').defaultNow(),
	productEAN: varchar('productEAN', { length: 15 }),
	authorID: integer('authorID').references(() => users.id, {
		onDelete: 'cascade'
	})
});

export const postContents = pgTable('PostContent', {
	id: serial('id').primaryKey(),
	content: text('content'),
	postID: integer('postID').references(() => posts.id, {
		onDelete: 'cascade',
		onUpdate: 'cascade'
	})
});

export const postReviews = pgTable(
	'PostReview',
	{
		id: serial('id').primaryKey(),
		like: boolean('like'),
		userID: integer('userID').references(() => users.id, {
			onDelete: 'cascade'
		}),
		postID: integer('postID').references(() => posts.id, {
			onDelete: 'cascade'
		})
	},
	(table) => ({
		unq: unique().on(table.userID, table.postID)
	})
);

export const postReviewRelations = relations(postReviews, ({ one }) => ({
	post: one(posts, {
		fields: [postReviews.postID],
		references: [posts.id]
	}),
	author: one(users, {
		fields: [postReviews.userID],
		references: [users.id]
	})
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	comments: many(comments),
	reviews: many(postReviews),
	content: one(postContents, {
		fields: [posts.id],
		references: [postContents.postID]
	}),
	author: one(users, {
		relationName: 'ownPosts',
		fields: [posts.authorID],
		references: [users.id]
	})
}));

export const comments = pgTable('Comment', {
	id: serial('id').primaryKey(),
	body: text('body'),
	date: timestamp('date').defaultNow(),
	postID: integer('postID').references(() => posts.id, { onDelete: 'cascade' }),
	authorID: integer('authorID').references(() => users.id, {
		onDelete: 'cascade'
	})
});

export const commentsRelations = relations(comments, ({ one }) => ({
	post: one(posts, {
		fields: [comments.postID],
		references: [posts.id]
	}),
	author: one(users, {
		fields: [comments.authorID],
		references: [users.id]
	})
}));

export const submissions = pgTable('Submission', {
	id: serial('id').primaryKey(),
	body: jsonb('body'),
	status: varchar('status', { enum: ['pending', 'processed'] }),
	date: timestamp('date').defaultNow(),
	productEAN: varchar('productEAN', { length: 15 }),
	authorID: integer('authorID').references(() => users.id, {
		onDelete: 'cascade'
	})
});

export const submissionRelations = relations(submissions, ({ one }) => ({
	author: one(users, {
		fields: [submissions.authorID],
		references: [users.id]
	})
}));
