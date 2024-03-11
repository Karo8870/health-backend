import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import {
	comments,
	postContents,
	postReviews,
	posts,
	users
} from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, count, eq, isNull, sql } from 'drizzle-orm';
import { ReviewPostDto } from './dto/review-post.dto';
import { alias } from 'drizzle-orm/pg-core';

@Injectable()
export class PostService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async create(createPostDto: CreatePostDto) {
		try {
			const [{ id }] = await this.db
				.insert(posts)
				.values({
					authorID: this.cls.get('userID'),
					productEAN: createPostDto.ean.replace(/^0/, ''),
					title: createPostDto.title
				})
				.returning({
					id: posts.id
				});

			await this.db.insert(postContents).values({
				postID: id,
				content: createPostDto.content
			});
		} catch (e) {
			console.log(e.detail);
		}
	}

	async review(id: number, reviewPostDto: ReviewPostDto) {
		await this.db
			.insert(postReviews)
			.values({
				postID: id,
				userID: this.cls.get('userID'),
				like: reviewPostDto.like
			})
			.onConflictDoUpdate({
				target: [postReviews.userID, postReviews.postID],
				set: {
					like: reviewPostDto.like
				}
			});
	}

	async findOne(id: number) {
		const ownReview = alias(postReviews, 'ownReview');
		const commentAuthor = alias(users, 'commentAuthor');

		return (
			await this.db
				.select({
					body: postContents.content,
					likes: count(
						sql`DISTINCT CASE WHEN ${eq(postReviews.like, true)} THEN 1 END`
					),
					dislikes: count(
						sql`DISTINCT CASE WHEN ${eq(postReviews.like, false)} THEN 1 END`
					),
					comments: sql`COALESCE(JSONB_AGG(JSONB_BUILD_OBJECT('id', ${comments.id}, 'body', ${comments.body}, 'date', ${comments.date}, 'author', JSONB_BUILD_OBJECT('id', ${commentAuthor.id}, 'user', ${commentAuthor.user}, 'firstName', ${commentAuthor.firstName}, 'lastName', ${commentAuthor.lastName}, 'email', ${commentAuthor.email}))) FILTER (WHERE ${comments.id} IS NOT NULL), '[]'::jsonb)`,
					author: {
						id: users.id,
						user: users.user,
						firstName: users.firstName,
						lastName: users.lastName,
						email: users.email
					},
					review: ownReview.like
				})
				.from(posts)
				.leftJoin(postContents, eq(postContents.postID, id))
				.leftJoin(
					ownReview,
					and(
						eq(ownReview.postID, id),
						eq(ownReview.userID, this.cls.get('userID'))
					)
				)
				.leftJoin(users, eq(users.id, posts.authorID))
				.leftJoin(postReviews, eq(postReviews.postID, id))
				.leftJoin(comments, eq(comments.postID, id))
				.leftJoin(commentAuthor, eq(commentAuthor.id, comments.authorID))
				.where(eq(posts.id, id))
				.groupBy(postContents.content, users.id, ownReview.like)
				.limit(1)
		)[0];
	}

	async findMany(ean: string) {
		const ownReview = alias(postReviews, 'ownReview');
		const commentAuthor = alias(users, 'commentAuthor');

		return this.db
			.select({
				body: postContents.content,
				likes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, true)} THEN 1 END`
				),
				dislikes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, false)} THEN 1 END`
				),
				comments: sql`COALESCE(JSONB_AGG(JSONB_BUILD_OBJECT('id', ${comments.id}, 'body', ${comments.body}, 'date', ${comments.date}, 'author', JSONB_BUILD_OBJECT('id', ${commentAuthor.id}, 'user', ${commentAuthor.user}, 'firstName', ${commentAuthor.firstName}, 'lastName', ${commentAuthor.lastName}, 'email', ${commentAuthor.email}))) FILTER (WHERE ${comments.id} IS NOT NULL), '[]'::jsonb)`,
				author: {
					id: users.id,
					user: users.user,
					firstName: users.firstName,
					lastName: users.lastName,
					email: users.email
				},
				review: ownReview.like
			})
			.from(posts)
			.leftJoin(postContents, eq(postContents.postID, posts.id))
			.leftJoin(
				ownReview,
				and(
					eq(ownReview.postID, posts.id),
					eq(ownReview.userID, this.cls.get('userID'))
				)
			)
			.leftJoin(users, eq(users.id, posts.authorID))
			.leftJoin(postReviews, eq(postReviews.postID, posts.id))
			.leftJoin(comments, eq(comments.postID, posts.id))
			.leftJoin(commentAuthor, eq(commentAuthor.id, comments.authorID))
			.where(eq(posts.productEAN, ean.replace(/^0/, '')))
			.groupBy(postContents.content, users.id, ownReview.like);
	}

	async findGeneral() {
		const ownReview = alias(postReviews, 'ownReview');
		const commentAuthor = alias(users, 'commentAuthor');

		return this.db
			.select({
				body: postContents.content,
				likes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, true)} THEN 1 END`
				),
				dislikes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, false)} THEN 1 END`
				),
				comments: sql`COALESCE(JSONB_AGG(JSONB_BUILD_OBJECT('id', ${comments.id}, 'body', ${comments.body}, 'date', ${comments.date}, 'author', JSONB_BUILD_OBJECT('id', ${commentAuthor.id}, 'user', ${commentAuthor.user}, 'firstName', ${commentAuthor.firstName}, 'lastName', ${commentAuthor.lastName}, 'email', ${commentAuthor.email}))) FILTER (WHERE ${comments.id} IS NOT NULL), '[]'::jsonb)`,
				author: {
					id: users.id,
					user: users.user,
					firstName: users.firstName,
					lastName: users.lastName,
					email: users.email
				},
				review: ownReview.like
			})
			.from(posts)
			.leftJoin(postContents, eq(postContents.postID, posts.id))
			.leftJoin(
				ownReview,
				and(
					eq(ownReview.postID, posts.id),
					eq(ownReview.userID, this.cls.get('userID'))
				)
			)
			.leftJoin(users, eq(users.id, posts.authorID))
			.leftJoin(postReviews, eq(postReviews.postID, posts.id))
			.leftJoin(comments, eq(comments.postID, posts.id))
			.leftJoin(commentAuthor, eq(commentAuthor.id, comments.authorID))
			.where(isNull(posts.productEAN))
			.groupBy(postContents.content, users.id, ownReview.like);
	}

	async findOwn() {
		const ownReview = alias(postReviews, 'ownReview');
		const commentAuthor = alias(users, 'commentAuthor');

		return this.db
			.select({
				body: postContents.content,
				likes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, true)} THEN 1 END`
				),
				dislikes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, false)} THEN 1 END`
				),
				comments: sql`COALESCE(JSONB_AGG(JSONB_BUILD_OBJECT('id', ${comments.id}, 'body', ${comments.body}, 'date', ${comments.date}, 'author', JSONB_BUILD_OBJECT('id', ${commentAuthor.id}, 'user', ${commentAuthor.user}, 'firstName', ${commentAuthor.firstName}, 'lastName', ${commentAuthor.lastName}, 'email', ${commentAuthor.email}))) FILTER (WHERE ${comments.id} IS NOT NULL), '[]'::jsonb)`,
				author: {
					id: users.id,
					user: users.user,
					firstName: users.firstName,
					lastName: users.lastName,
					email: users.email
				},
				review: ownReview.like
			})
			.from(posts)
			.leftJoin(postContents, eq(postContents.postID, posts.id))
			.leftJoin(
				ownReview,
				and(
					eq(ownReview.postID, posts.id),
					eq(ownReview.userID, this.cls.get('userID'))
				)
			)
			.leftJoin(users, eq(users.id, posts.authorID))
			.leftJoin(postReviews, eq(postReviews.postID, posts.id))
			.leftJoin(comments, eq(comments.postID, posts.id))
			.leftJoin(commentAuthor, eq(commentAuthor.id, comments.authorID))
			.where(eq(posts.authorID, this.cls.get('userID')))
			.groupBy(postContents.content, users.id, ownReview.like);
	}

	async update(id: number, updateReviewDto: UpdatePostDto) {
		if (updateReviewDto.title) {
			await this.db
				.update(posts)
				.set({
					title: updateReviewDto.title
				})
				.where(
					and(eq(posts.id, id), eq(posts.authorID, this.cls.get('userID')))
				);
		}

		if (updateReviewDto.content) {
			await this.db
				.update(postContents)
				.set({
					content: updateReviewDto.content
				})
				.where(eq(postContents.postID, id));
		}
	}

	async remove(id: number) {
		await this.db
			.delete(posts)
			.where(and(eq(posts.id, id), eq(posts.authorID, this.cls.get('userID'))));
	}

	async deleteReview(id: number) {
		await this.db
			.delete(postReviews)
			.where(
				and(
					eq(postReviews.postID, id),
					eq(postReviews.userID, this.cls.get('userID'))
				)
			);
	}
}

sql`SELECT pc.content AS body, COUNT(CASE WHEN pr.like = true THEN 1 END) AS likes, COUNT(CASE WHEN pr.like = false THEN 1 END) AS dislikes, JSON_BUILD_OBJECT('id', a.id, 'user', a.user, 'firstName', a."firstName", 'lastName', a."lastName", 'email', a.email) AS author, own.like AS review, JSON_AGG(JSON_BUILD_OBJECT('id', c.id, 'body', c.body, 'date', c.date, 'author', ca.*)) AS comments FROM "Post" p LEFT JOIN "PostContent" pc ON pc."postID" = p.id LEFT JOIN "PostReview" own ON own."postID" = p.id AND own."userID" = 4 LEFT JOIN "User" a ON p."authorID" = a.id LEFT JOIN "PostReview" pr ON p.id = pr."postID" LEFT JOIN "Comment" c ON c."postID" = p.id LEFT JOIN "User" ca ON c."authorID" = ca.id WHERE p.id = 6 GROUP BY pc.content, a.id, own.like;`;
