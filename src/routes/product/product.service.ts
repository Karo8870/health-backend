import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { productDetails, productReviews } from '../../drizzle/schema';
import {
	and,
	between,
	count,
	eq,
	gt,
	gte,
	lt,
	lte,
	or,
	sql
} from 'drizzle-orm';
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

	generateWhereClause(recommendProductDto: any) {
		return Object.keys(recommendProductDto).map((key) => {
			const path = key.split('.');

			const sqlCond = sql(
				// @ts-ignore
				[
					'"ProductDetails".data -> ',
					...Array(path.length - 2).fill(' -> '),
					'->>'
				],
				...path
			);

			switch (recommendProductDto[key].action) {
				case 'eq':
					return eq(sqlCond, recommendProductDto[key].value);

				case 'gt':
					return gt(sqlCond, recommendProductDto[key].value);

				case 'gte':
					return gte(sqlCond, recommendProductDto[key].value);

				case 'lt':
					return lt(sqlCond, recommendProductDto[key].value);

				case 'lte':
					return lte(sqlCond, recommendProductDto[key].value);

				case 'contains':
					return sql`(${sqlCond})::jsonb @> ${JSON.stringify(recommendProductDto[key].value)}::jsonb`;

				case 'not_contains':
					return sql`NOT (${sqlCond})::jsonb @> ${JSON.stringify(recommendProductDto[key].value)}::jsonb`;

				case 'bt':
					return between(
						sqlCond,
						recommendProductDto[key].value.min,
						recommendProductDto[key].value.max
					);
			}
		});
	}

	async recommend(recommendProductDto: { optional: any; mandatory: any }) {
		return this.db
			.select({
				data: productDetails.data,
				id: productDetails.id,
				ean: productDetails.ean,
				upVotes: count(
					sql`CASE WHEN ${eq(productReviews.like, true)} THEN 1 END`
				),
				downVotes: count(
					sql`CASE WHEN ${eq(productReviews.like, false)} THEN 1 END`
				)
			})
			.from(productDetails)
			.where(
				and(
					or(...this.generateWhereClause(recommendProductDto.optional)),
					...this.generateWhereClause(recommendProductDto.mandatory)
				)
			)
			.leftJoin(
				productReviews,
				eq(productReviews.productEAN, productDetails.ean)
			)
			.limit(10);
	}

	async search(term: string) {
		return this.db
			.select({
				data: productDetails.data,
				id: productDetails.id,
				ean: productDetails.ean,
				upVotes: count(
					sql`CASE WHEN ${eq(productReviews.like, true)} THEN 1 END`
				),
				downVotes: count(
					sql`CASE WHEN ${eq(productReviews.like, false)} THEN 1 END`
				)
			})
			.from(productDetails)
			.where(
				sql`similarity(${term}, ${productDetails.data} -> 'product' ->> 'product_name') > 0.4`
			)
			.leftJoin(
				productReviews,
				eq(productReviews.productEAN, productDetails.ean)
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
