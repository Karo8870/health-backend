import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { preferences, users } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { eq } from 'drizzle-orm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async getProfile() {
		return this.db
			.select({
				id: users.id,
				user: users.user,
				email: users.email,
				firstName: users.firstName,
				lastName: users.lastName
			})
			.from(users)
			.where(eq(users.id, this.cls.get('userID')));
	}

	async updatePreferences(updateProfileDto: UpdateProfileDto) {
		await this.db
			.update(preferences)
			.set({
				data: updateProfileDto.data
			})
			.where(eq(users.id, this.cls.get('userID')));
	}
}
