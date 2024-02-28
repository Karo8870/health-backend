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

	async create(createPostDto: CreatePostDto) {
		await this.db.insert(posts).values({
			authorID: this.cls.get('userID'),
			body: createPostDto.body,
			productEAN: createPostDto.ean
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
				target: [postReviews.userID, postReviews.postID],
				set: {
					like: reviewPostDto.like
				}
			});
	}

	async findOne(id: number) {
		return {
			body: (await this.db.select().from(posts).where(eq(posts.id, id)))[0],
			...(
				await this.db
					.select({
						likes: count()
					})
					.from(postReviews)
					.where(and(eq(postReviews.postID, id), eq(postReviews.like, true)))
			)[0],
			...(
				await this.db
					.select({
						dislikes: count()
					})
					.from(postReviews)
					.where(and(eq(postReviews.postID, id), eq(postReviews.like, false)))
			)[0]
		};
	}

	async findMany(ean: string) {
		return (
			await this.db
				.select({
					id: posts.id
				})
				.from(posts)
				.where(eq(posts.productEAN, ean))
		).map((el) => el.id);
	}

	async update(id: number, updateReviewDto: UpdatePostDto) {
		await this.db
			.update(posts)
			.set({
				body: updateReviewDto.body
			})
			.where(and(eq(posts.id, id), eq(posts.authorID, this.cls.get('userID'))));
	}

	async remove(id: number) {
		await this.db
			.delete(posts)
			.where(and(eq(posts.id, id), eq(posts.authorID, this.cls.get('userID'))));
	}

	async deleteReview(id: number) {
		await this.db.delete(postReviews).where(eq(postReviews.postID, id));
	}
}
