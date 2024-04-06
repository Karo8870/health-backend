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
		const [x] = await this.db.select().from(dailyIntakes).where(and(eq(dailyIntakes.userID, this.cls.get('userID')), eq(dailyIntakes.date, `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)));

		const d = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`;

		console.log(this.db.update(dailyIntakes).set({
			data: createDailyIntakeDto.data
		}).where(and(eq(dailyIntakes.userID, this.cls.get('userID')), eq(dailyIntakes.date, d))).toSQL());

		if (!x) {
			await this.db.insert(dailyIntakes).values({
				date: sql`NOW()`,
				data: createDailyIntakeDto.data,
				userID: this.cls.get('userID')
			});

			console.log(await this.db.update(users).set({
				points: sql`${users.points} + 5`
			}).where(eq(users.id, this.cls.get('userID'))).returning({
				x: users.id
			}));
		} else {
			console.log(await this.db.update(dailyIntakes).set({
				data: createDailyIntakeDto.data
			}).where(and(eq(dailyIntakes.userID, this.cls.get('userID')))).returning({
				x: dailyIntakes.data
			}));
		}
	}

	findAll() {
		return this.db.select().from(dailyIntakes).where(eq(dailyIntakes.userID, this.cls.get('userID')));
	}
}
