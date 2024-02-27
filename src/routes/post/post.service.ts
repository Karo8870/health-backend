import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { postReviews, posts } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, count, eq } from 'drizzle-orm';
import { ReviewPostDto } from './dto/review-post.dto';

@Injectable()
export class PostService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async create(createReviewDto: CreatePostDto) {
		return this.db.insert(posts).values({
			authorID: this.cls.get('userID'),
			body: createReviewDto.body
		});
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
				set: {
					like: reviewPostDto.like
				},
				target: [postReviews.id]
			});
	}

	async findOne(id: number) {
		return this.db
			.select({
				body: posts.body,
				id: posts.id,
				likes: count(eq(postReviews.like, true)),
				dislikes: count(eq(postReviews.like, false))
			})
			.from(posts)
			.where(eq(posts.id, id))
			.leftJoin(postReviews, eq(postReviews.postID, posts.id));
	}

	async findMany(ean: number) {
		return this.db
			.select({
				body: posts.body,
				id: posts.id,
				likes: count(eq(postReviews.like, true)),
				dislikes: count(eq(postReviews.like, false))
			})
			.from(posts)
			.where(eq(posts.productEAN, ean))
			.leftJoin(postReviews, eq(postReviews.postID, posts.id));
	}

	async update(id: number, updateReviewDto: UpdatePostDto) {
		return this.db
			.update(posts)
			.set({
				body: updateReviewDto.body
			})
			.where(and(eq(posts.id, id), eq(posts.authorID, this.cls.get('userID'))));
	}

	async remove(id: number) {
		return this.db
			.delete(posts)
			.where(and(eq(posts.id, id), eq(posts.authorID, this.cls.get('userID'))));
	}

	async deleteReview(id: number) {
		await this.db.delete(postReviews).where(eq(postReviews.postID, id));
	}
}
