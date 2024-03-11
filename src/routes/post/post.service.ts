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
import { alias, PgColumn } from 'drizzle-orm/pg-core';

@Injectable()
export class PostService {
	private ownReview = alias(postReviews, 'ownReview');
	private commentAuthor = alias(users, 'commentAuthor');

	private selectPostGroupBy = [
		postContents.content,
		posts.id,
		posts.title,
		posts.date,
		users.id,
		this.ownReview.like
	];

	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	generateSelect(id: number | PgColumn) {
		return this.db
			.select({
				id: posts.id,
				title: posts.title,
				body: postContents.content,
				date: posts.date,
				upVotes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, true)} THEN 1 END`
				),
				downVotes: count(
					sql`DISTINCT CASE WHEN ${eq(postReviews.like, false)} THEN 1 END`
				),
				comments: sql`COALESCE(JSONB_AGG(JSONB_BUILD_OBJECT('id', ${comments.id}, 'body', ${comments.body}, 'date', ${comments.date}, 'author', JSONB_BUILD_OBJECT('id', ${this.commentAuthor.id}, 'user', ${this.commentAuthor.user}, 'firstName', ${this.commentAuthor.firstName}, 'lastName', ${this.commentAuthor.lastName}, 'email', ${this.commentAuthor.email}))) FILTER (WHERE ${comments.id} IS NOT NULL), '[]'::jsonb)`,
				author: {
					id: users.id,
					user: users.user,
					firstName: users.firstName,
					lastName: users.lastName,
					email: users.email
				},
				vote: this.ownReview.like
			})
			.from(posts)
			.leftJoin(postContents, eq(postContents.postID, id))
			.leftJoin(
				this.ownReview,
				and(
					eq(this.ownReview.postID, id),
					eq(this.ownReview.userID, this.cls.get('userID'))
				)
			)
			.leftJoin(users, eq(users.id, posts.authorID))
			.leftJoin(postReviews, eq(postReviews.postID, id))
			.leftJoin(comments, eq(comments.postID, id))
			.leftJoin(
				this.commentAuthor,
				eq(this.commentAuthor.id, comments.authorID)
			);
	}

	async create(createPostDto: CreatePostDto) {
		try {
			const [{ id }] = await this.db
				.insert(posts)
				.values({
					authorID: this.cls.get('userID'),
					productEAN: createPostDto.ean?.replace(/^0/, ''),
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
			console.log(e);
		}
	}

	async review(id: number, reviewPostDto: ReviewPostDto) {
		await this.db
			.insert(postReviews)
			.values({
				postID: id,
				userID: this.cls.get('userID'),
				like: reviewPostDto.vote
			})
			.onConflictDoUpdate({
				target: [postReviews.userID, postReviews.postID],
				set: {
					like: reviewPostDto.vote
				}
			});
	}

	async findOne(id: number) {
		return (
			await this.generateSelect(id)
				.where(eq(posts.id, id))
				.groupBy(...this.selectPostGroupBy)
				.limit(1)
		)[0];
	}

	async findMany(ean: string) {
		return this.generateSelect(posts.id)
			.where(eq(posts.productEAN, ean.replace(/^0/, '')))
			.groupBy(...this.selectPostGroupBy);
	}

	async findGeneral() {
		return this.generateSelect(posts.id)
			.where(isNull(posts.productEAN))
			.groupBy(...this.selectPostGroupBy);
	}

	async findOwn() {
		return this.generateSelect(posts.id)
			.where(eq(posts.authorID, this.cls.get('userID')))
			.groupBy(...this.selectPostGroupBy);
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
