import { Inject, Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { challenges } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { eq } from 'drizzle-orm';

@Injectable()
export class ChallengeService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	create(createChallengeDto: CreateChallengeDto) {
		return this.db.insert(challenges).values({
			startDate: new Date(createChallengeDto.startDate),
			endDate: new Date(createChallengeDto.endDate),
			title: createChallengeDto.title,
			description: createChallengeDto.description
		});
	}

	findAll() {
		return this.db.select().from(challenges);
	}

	findOne(id: number) {
		return this.db.select().from(challenges).where(eq(challenges.id, id));
	}

	update(id: number, updateChallengeDto: UpdateChallengeDto) {
		return this.db.update(challenges).set({
			title: updateChallengeDto.title,
			description: updateChallengeDto.description,
			startDate: new Date(updateChallengeDto.startDate),
			endDate: new Date(updateChallengeDto.endDate)
		}).where(eq(challenges.id, id));
	}

	remove(id: number) {
		return this.db.delete(challenges).where(eq(challenges.id, id));
	}
}
