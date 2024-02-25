import { Inject, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { reviews } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { eq } from 'drizzle-orm';

@Injectable()
export class ReviewService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	create(createReviewDto: CreateReviewDto) {
		return this.db.insert(reviews).values({
			authorID: this.cls.get('userID'),
			body: createReviewDto.body,
			value: createReviewDto.value
		});
	}

	update(id: number, updateReviewDto: UpdateReviewDto) {
		return this.db
			.update(reviews)
			.set({
				body: updateReviewDto.body,
				value: updateReviewDto.value
			})
			.where(eq(reviews.id, id));
	}

	remove(id: number) {
		return this.db.delete(reviews).where(eq(reviews.id, id));
	}
}
