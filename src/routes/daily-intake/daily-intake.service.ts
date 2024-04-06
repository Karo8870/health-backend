import { Inject, Injectable } from '@nestjs/common';
import { CreateDailyIntakeDto } from './dto/create-daily-intake.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { dailyIntakes, users } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class DailyIntakeService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	async create(createDailyIntakeDto: CreateDailyIntakeDto) {
		const conflict: boolean = (await this.db.insert(dailyIntakes).values({
			date: sql`CURRENT_DATE()`,
			data: createDailyIntakeDto.data
		}).onConflictDoUpdate({
			target: [dailyIntakes.date, dailyIntakes.userID],
			set: {
				data: createDailyIntakeDto.data
			}
		}).returning({
			conflict_detected: sql`CASE WHEN (xmin = txid_current()) THEN FALSE ELSE TRUE END`
		}))[0].conflict_detected as boolean;

		if (!conflict) {
			this.db.update(users).set({
				points: sql`${users.points} + 5`
			}).where(eq(users.id, this.cls.get('userID')));
		}
	}

	findAll() {
		return this.db.select().from(dailyIntakes).where(eq(dailyIntakes.userID, this.cls.get('userID')));
	}
}
