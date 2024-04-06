import {
	boolean,
	date,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	unique,
	varchar
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const users = pgTable('User', {
	id: serial('id').primaryKey(),
	firstName: varchar('firstName', { length: 30 }),
	lastName: varchar('lastName', { length: 30 }),
	user: varchar('user', { length: 30 }).unique(),
	password: varchar('password'),
	email: varchar('email').unique(),
	admin: boolean('admin').default(false),
	points: integer('points').default(0),
	dailyChallenge: timestamp('dailyChallenge').default(sql`TO_TIMESTAMP(0)`),
	score: integer('score').default(0),
	premium: timestamp('premium').default(sql`TO_TIMESTAMP(0)`)
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
	}),
	badges: many(badgesToUsers),
	dailyIntakes: many(dailyIntakes),
	teams: many(usersToTeams),
	invites: many(teamInvites),
	teamsOwner: many(teams)
}));

export const preferences = pgTable('Restriction', {
	id: serial('id').primaryKey(),
	userID: integer('userID').references(() => users.id, { onDelete: 'cascade' }),
	data: jsonb('data'),
	personal: jsonb('personal'),
	goals: jsonb('goals')
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

export const badges = pgTable('Badge', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 30 }),
	description: text('description')
});

export const badgesRelations = relations(badges, ({ many }) => ({
	users: many(badgesToUsers)
}));

export const badgesToUsers = pgTable('BadgeToUser', {
	badgeID: integer('badgeID').notNull().references(() => badges.id),
	userID: integer('userID').notNull().references(() => users.id)
}, (t) => ({
	pk: primaryKey({
		columns: [t.badgeID, t.userID]
	})
}));

export const badgesToUsersRelations = relations(badgesToUsers, ({ one }) => ({
	badge: one(badges, {
		fields: [badgesToUsers.badgeID],
		references: [badges.id]
	}),
	user: one(users, {
		fields: [badgesToUsers.userID],
		references: [users.id]
	})
}));

export const challenges = pgTable('CommunityChallenge', {
	id: serial('id').primaryKey(),
	startDate: timestamp('startDate'),
	endDate: timestamp('endDate'),
	title: varchar('title', { length: 100 }),
	description: text('description'),
	goal: integer('goal'),
	unit: varchar('unit', { length: 100 }),
	organizer: varchar('organizer')
});

export const challengesRelations = relations(challenges, ({ many }) => ({
	teams: many(teams)
}));

export const redeems = pgTable('Redeem', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 100 }),
	description: text('description'),
	points: integer('points').default(0),
	cost: integer('cost'),
	reward: text('reward')
});

export const dailyIntakes = pgTable('DailyIntake', {
	userID: integer('userID'),
	date: date('date'),
	data: jsonb('data')
}, (t) => ({
	pk: primaryKey({
		columns: [t.date, t.userID]
	})
}));

export const dailyIntakesRelations = relations(dailyIntakes, ({ one }) => ({
	user: one(users, {
		fields: [dailyIntakes.userID],
		references: [users.id]
	})
}));

export const teams = pgTable('Teams', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 100 }),
	challengeID: integer('challengeID').references(() => challenges.id),
	creatorID: integer('creatorID').references(() => users.id)
});

export const teamsRelations = relations(teams, ({ one, many }) => ({
	users: many(usersToTeams),
	invites: many(teamInvites),
	challenge: one(challenges, {
		fields: [teams.challengeID],
		references: [challenges.id]
	}),
	creator: one(users, {
		fields: [teams.creatorID],
		references: [users.id]
	})
}));

export const usersToTeams = pgTable('UserToTeam', {
	userID: integer('userID').references(() => users.id),
	teamID: integer('teamID').references(() => teams.id)
}, (t) => ({
	pk: primaryKey({
		columns: [t.userID, t.teamID]
	})
}));

export const usersToTeamsRelations = relations(usersToTeams, ({ one }) => ({
	team: one(teams, {
		fields: [usersToTeams.teamID],
		references: [teams.id]
	}),
	user: one(users, {
		fields: [usersToTeams.userID],
		references: [users.id]
	})
}));

export const teamInvites = pgTable('TeamInvite', {
	teamID: integer('teamID').references(() => teams.id),
	userID: integer('userID').references(() => users.id)
}, (t) => ({
	pk: primaryKey({
		columns: [t.userID, t.teamID]
	})
}));

export const teamInvitesRelations = relations(teamInvites, ({ one }) => ({
	user: one(users, {
		fields: [teamInvites.userID],
		references: [users.id]
	}),
	team: one(teams, {
		fields: [teamInvites.teamID],
		references: [teams.id]
	})
}));