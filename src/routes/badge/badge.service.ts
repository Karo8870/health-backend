import { Inject, Injectable } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { badges, badgesToUsers } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { eq } from 'drizzle-orm';
import { GetBadgeDdo } from './dto/get-badge.tdo';

@Injectable()
export class BadgeService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	create(createBadgeDto: CreateBadgeDto) {
		return this.db.insert(badges).values({
			name: createBadgeDto.name,
			description: createBadgeDto.description
		});
	}

	getBadge(getBadgeDto: GetBadgeDdo) {
		return this.db.insert(badgesToUsers).values({
			badgeID: getBadgeDto.badgeID,
			userID: this.cls.get('userID')
		});
	}

	async findAll() {
		return (await this.db.select({
			badgeID: badgesToUsers.badgeID
		}).from(badgesToUsers).where(eq(badgesToUsers.userID, this.cls.get('userID')))).map(el => el.badgeID);
	}

	async findOne(id: number) {
		return this.db.select().from(badges).where(eq(badges.id, id));
	}

	update(id: number, updateBadgeDto: UpdateBadgeDto) {
		return this.db.update(badges).set({
			name: updateBadgeDto.name,
			description: updateBadgeDto.description
		}).where(eq(badges.id, id));
	}

	remove(id: number) {
		return this.db.delete(badges).where(eq(badges.id, id));
	}
}
