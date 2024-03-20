import { Inject, Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { productDetails, submissions } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, eq } from 'drizzle-orm';
import { ValidateSubmissionsDto } from './dto/validate-submissions.dto';
import { inArray } from 'drizzle-orm/sql/expressions/conditions';

@Injectable()
export class SubmissionService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async create(createSubmissionDto: CreateSubmissionDto) {
		await this.db.insert(submissions).values({
			authorID: this.cls.get('userID'),
			productEAN: createSubmissionDto.ean.replace(/^0/, ''),
			status: 'pending',
			body: createSubmissionDto.body
		});
	}

	async findOwn() {
		return this.db.query.submissions.findMany({
			where: eq(submissions.authorID, this.cls.get('userID'))
		});
	}

	async findAll() {
		return (
			await this.db
				.selectDistinctOn([submissions.productEAN], {
					ean: submissions.productEAN
				})
				.from(submissions)
				.where(eq(submissions.status, 'pending'))
		).map((el) => el.ean);
	}

	async findOne(id: number) {
		return this.db.query.submissions.findFirst({
			where: and(
				eq(submissions.id, id),
				eq(submissions.authorID, this.cls.get('userID'))
			)
		});
	}

	async findAllByProduct(ean: string) {
		return {
			submissions: await this.db.query.submissions.findMany({
				where: and(
					eq(submissions.productEAN, ean.replace(/^0/, '')),
					eq(submissions.status, 'pending')
				)
			}),
			product: await this.db.query.productDetails.findFirst({
				where: eq(productDetails.ean, ean.replace(/^0/, ''))
			})
		};
	}

	async update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
		await this.db
			.update(submissions)
			.set({
				body: updateSubmissionDto.body
			})
			.where(
				and(
					eq(submissions.id, id),
					eq(submissions.authorID, this.cls.get('userID'))
				)
			);
	}

	async validate(validateSubmissionsDto: ValidateSubmissionsDto) {
		await this.db
			.update(submissions)
			.set({ status: 'processed' })
			.where(inArray(submissions.id, validateSubmissionsDto.submissions));

		await this.db
			.insert(productDetails)
			.values({
				data: validateSubmissionsDto.body,
				ean: validateSubmissionsDto.ean.replace(/^0/, '')
			})
			.onConflictDoUpdate({
				set: {
					data: validateSubmissionsDto.body
				},
				target: [productDetails.ean]
			});
	}

	async remove(id: number) {
		await this.db
			.delete(submissions)
			.where(
				and(
					eq(submissions.id, id),
					eq(submissions.authorID, this.cls.get('userID'))
				)
			);
	}
}
