import { Inject, Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { challenges, teams, users } from '../../drizzle/schema';
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
			description: createChallengeDto.description,
			unit: createChallengeDto.unit,
			goal: createChallengeDto.goal,
			organizer: createChallengeDto.organizer
		});
	}

	findAll() {
		return this.db.select().from(challenges);
	}

	async findOne(id: number) {
		return (await this.db.select().from(challenges).where(eq(challenges.id, id)))[0];
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

	getUsers(id: number) {
		return this.db.select().from(teams).where(eq(teams.challengeID, id));
	}

	getGlobalUsers() {
		return this.db.select().from(users);
	}

	async getTeamUsers(id: number) {
		const data = await this.db.query.teams.findFirst({
			where: eq(teams.id, id),
			with: {
				users: {
					with: {
						user: {
							with: {
								dailyIntakes: {
									columns: {
										data: true
									}
								}
							}
						}
					}
				}
			}
		});

		console.log(JSON.stringify(data, null, 2));

		const intakes = data.users.map(el => el.user.dailyIntakes) as { data: any }[][];

		const sums = {
			steps: 0,
			kcal: 0,
			minutes: 0
		};

		console.log(JSON.stringify(intakes, null, 2));

		for (const i of intakes) {
			for (const j of i) {
				if (j.data.steps) {
					sums.steps += j.data.steps;
				}

				if (j.data.kcal) {
					sums.steps += j.data.kcal;
				}

				if (j.data.minutes) {
					sums.steps += j.data.minutes;
				}
			}
		}

		return sums;
	}
}
