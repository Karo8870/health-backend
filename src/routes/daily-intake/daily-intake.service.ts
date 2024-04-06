import { Inject, Injectable } from '@nestjs/common';
import { CreateDailyIntakeDto } from './dto/create-daily-intake.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { dailyIntakes, users } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, eq, sql } from 'drizzle-orm';

@Injectable()
export class DailyIntakeService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	async create(createDailyIntakeDto: CreateDailyIntakeDto) {
		console.log(222);

		const [x] = await this.db.select().from(dailyIntakes).where(and(eq(dailyIntakes.userID, this.cls.get('userID')), eq(dailyIntakes.date, `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`)));

		const conflict: boolean = (await this.db.insert(dailyIntakes).values({
			date: sql`TO_TIMESTAMP(0)`,
			data: createDailyIntakeDto.data
		}).onConflictDoUpdate({
			target: [dailyIntakes.date, dailyIntakes.userID],
			set: {
				data: createDailyIntakeDto.data
			}
		}).returning({
			conflict_detected: sql`CASE WHEN (xmin = txid_current()) THEN FALSE ELSE TRUE END`
		}))[0].conflict_detected as boolean;

		console.log(333);

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
