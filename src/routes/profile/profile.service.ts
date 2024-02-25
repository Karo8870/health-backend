import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { users } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProfileService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async getProfile() {
		return this.db.query.users.findFirst({
			where: eq(users.id, this.cls.get('userID')),
			columns: {
				id: true,
				user: true,
				email: true,
				lastName: true,
				firstName: true
			}
		});
	}

	async updatePreferences() {

	}
}
