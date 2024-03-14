import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { productDetails, productReviews } from '../../drizzle/schema';
import { and, count, eq, sql } from 'drizzle-orm';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { ReviewProductDto } from './dto/review-product.dto';

@Injectable()
export class ProductService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async review(ean: string, reviewProductDto: ReviewProductDto) {
		await this.db
			.insert(productReviews)
			.values({
				productEAN: ean.replace(/^0/, ''),
				userID: this.cls.get('userID'),
				like: reviewProductDto.vote
			})
			.onConflictDoUpdate({
				target: [productReviews.userID, productReviews.productEAN],
				set: {
					like: reviewProductDto.vote
				}
			});
	}

	async search(term: string) {
		return this.db
			.select({
				data: productDetails.data,
				id: productDetails.id,
				ean: productDetails.ean
			})
			.from(productDetails)
			.where(
				sql`similarity(${term}, "ProductDetails".data -> 'product' ->> 'product_name') > 0.4`
			)
			.limit(10);
	}

	async findOne(ean: string) {
		return {
			...(
				await this.db
					.select({
						upVotes: count(
							sql`CASE WHEN ${eq(productReviews.like, true)} THEN 1 END`
						),
						downVotes: count(
							sql`CASE WHEN ${eq(productReviews.like, false)} THEN 1 END`
						)
					})
					.from(productReviews)
					.where(eq(productReviews.productEAN, ean.replace(/^0/, '')))
			)[0],
			...(
				await this.db
					.select({
						vote: productReviews.like
					})
					.from(productReviews)
					.where(
						and(
							eq(productReviews.userID, this.cls.get('userID')),
							eq(productReviews.productEAN, ean.replace(/^0/, ''))
						)
					)
			)[0],
			...(
				await this.db
					.select({
						body: productDetails.data
					})
					.from(productDetails)
					.where(eq(productDetails.ean, ean.replace(/^0/, '')))
					.limit(1)
			)[0]
		};
	}

	async deleteReview(ean: string) {
		await this.db
			.delete(productReviews)
			.where(
				and(
					eq(productReviews.productEAN, ean.replace(/^0/, '')),
					eq(productReviews.userID, this.cls.get('userID'))
				)
			);
	}
}
