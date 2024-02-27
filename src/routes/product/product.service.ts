import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { productDetails, productReviews } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { ReviewProductDto } from './dto/review-product.dto';

@Injectable()
export class ProductService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async review(ean: number, reviewProductDto: ReviewProductDto) {
		await this.db
			.insert(productReviews)
			.values({
				productEAN: ean,
				userID: this.cls.get('userID'),
				like: reviewProductDto.like
			})
			.onConflictDoUpdate({
				set: {
					like: reviewProductDto.like
				},
				target: [productReviews.id]
			});
	}

	findOne(ean: number) {
		return this.db.query.productDetails.findFirst({
			where: eq(productDetails.ean, ean)
		});
	}

	async deleteReview(ean: number) {
		await this.db
			.delete(productReviews)
			.where(eq(productReviews.productEAN, ean));
	}
}
