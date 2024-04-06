import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { AuthClsStore } from './auth.guard';

@Injectable()
export class PremiumGuard implements CanActivate {
	constructor(
		private cls: ClsService<AuthClsStore>,
		@Inject('DB') private db: NodePgDatabase<typeof schema>
	) {
	}

	async canActivate(_context: ExecutionContext): Promise<boolean> {
		const account = await this.db.query.users.findFirst({
			where: eq(users.id, this.cls.get('userID'))
		});

		console.log(account);

		return account.premium.getTime() > new Date().getTime();
	}
}