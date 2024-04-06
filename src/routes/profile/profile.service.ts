import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { preferences, users } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, eq, sql } from 'drizzle-orm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BuyPremiumDto } from './dto/buy-premium.dto';

@Injectable()
export class ProfileService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	async getProfile() {
		return this.db.query.users.findFirst({
			where: eq(users.id, this.cls.get('userID')),
			columns: {
				id: true,
				user: true,
				email: true,
				firstName: true,
				lastName: true,
				dailyChallenge: true,
				points: true,
				premium: true,
				admin: true,
				score: true
			}
		});
	}

	async getPreferences() {
		return (
			await this.db
				.select({
					data: preferences.data,
					personal: preferences.personal,
					goals: preferences.goals
				})
				.from(preferences)
				.where(eq(preferences.userID, this.cls.get('userID')))
		)[0];
	}

	async updatePreferences(updateProfileDto: UpdateProfileDto) {
		await this.db
			.update(preferences)
			.set({
				data: updateProfileDto.data
			})
			.where(eq(preferences.userID, this.cls.get('userID')))
			.returning({
				id: preferences.userID
			});
	}

	async updatePersonal(updateProfileDto: UpdateProfileDto) {
		await this.db
			.update(preferences)
			.set({
				personal: updateProfileDto.data
			})
			.where(eq(preferences.userID, this.cls.get('userID')))
			.returning({
				id: preferences.userID
			});
	}

	async updateGoals(updateProfileDto: UpdateProfileDto) {
		await this.db.update(preferences).set({
			goals: updateProfileDto.data
		}).where(eq(preferences.userID, this.cls.get('userID')))
			.returning({
				id: preferences.userID
			});
	}

	async buyPremium(buyPremiumDto: BuyPremiumDto) {
		await this.db.update(users).set({
			premium: new Date(buyPremiumDto.expire)
		}).where(eq(users.id, this.cls.get('userID')));
	}

	async dailyChallenge() {
		console.log(await this.db.update(users).set({
			dailyChallenge: new Date(),
			points: sql`${users.points} + 5`
		}).where(and(eq(users.id, this.cls.get('userID')), sql`${users.dailyChallenge} < NOW() - INTERVAL '24 hours'`)).returning({
			x: users.score
		}));
	}
}
