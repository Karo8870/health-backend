import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { postContents, postReviews, posts } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, count, eq, isNull } from 'drizzle-orm';
import { ReviewPostDto } from './dto/review-post.dto';

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
					productEAN: createPostDto.ean,
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
		return {
			like: await this.db
				.select()
				.from(postReviews)
				.where(
					and(
						eq(postReviews.postID, id),
						eq(postReviews.userID, this.cls.get('userID'))
					)
				),
			user: this.cls.get('userID'),
			body: await this.db.query.posts.findFirst({
				where: eq(posts.id, id),
				with: {
					content: true,
					reviews: true,
					comments: {
						with: {
							author: true
						}
					},
					author: {
						columns: {
							id: true,
							email: true,
							firstName: true,
							lastName: true,
							user: true
						}
					}
				}
			}),
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
		return {
			posts: await this.db.query.posts.findMany({
				where: eq(posts.productEAN, ean),
				with: {
					content: true,
					reviews: true,
					comments: {
						with: {
							author: true
						}
					},
					author: {
						columns: {
							id: true,
							email: true,
							firstName: true,
							lastName: true,
							user: true
						}
					}
				}
			}),
			user: this.cls.get('userID')
		};
	}

	async findGeneral() {
		return {
			posts: await this.db.query.posts.findMany({
				where: isNull(posts.productEAN),
				with: {
					content: true,
					reviews: true,
					comments: {
						with: {
							author: true
						}
					},
					author: {
						columns: {
							id: true,
							email: true,
							firstName: true,
							lastName: true,
							user: true
						}
					}
				}
			}),
			user: this.cls.get('userID')
		};
	}

	async findOwn() {
		return {
			posts: await this.db.query.posts.findMany({
				where: eq(posts.authorID, this.cls.get('userID')),
				with: {
					content: true,
					reviews: true,
					comments: {
						with: {
							author: true
						}
					},
					author: {
						columns: {
							id: true,
							email: true,
							firstName: true,
							lastName: true,
							user: true
						}
					}
				}
			}),
			user: this.cls.get('userID')
		};
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
