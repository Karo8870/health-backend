import { Inject, Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { submissions } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { eq } from 'drizzle-orm';

@Injectable()
export class SubmissionService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	create(createSubmissionDto: CreateSubmissionDto) {
		return this.db.insert(submissions).values({
			authorID: this.cls.get('userID'),
			status: 'pending',
			body: createSubmissionDto.body,
			ean: createSubmissionDto.ean
		});
	}

	findAll() {
		return this.db.query.submissions.findMany({
			where: eq(submissions.authorID, this.cls.get('userID'))
		});
	}

	findOne(id: number) {
		return this.db.query.submissions.findFirst({
			where: eq(submissions.id, id)
		});
	}

	update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
		return this.db
			.update(submissions)
			.set({
				body: updateSubmissionDto.body,
				ean: updateSubmissionDto.ean
			})
			.where(eq(submissions.id, id));
	}

	remove(id: number) {
		return this.db.delete(submissions).where(eq(submissions.id, id));
	}
}
