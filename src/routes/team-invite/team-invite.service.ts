import { Inject, Injectable } from '@nestjs/common';
import { CreateTeamInviteDto } from './dto/create-team-invite.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { teamInvites, usersToTeams } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class TeamInviteService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	create(createTeamInviteDto: CreateTeamInviteDto) {
		return this.db.insert(teamInvites).values({
			teamID: createTeamInviteDto.teamID,
			userID: createTeamInviteDto.userID
		});
	}

	findAll() {
		return this.db.select().from(teamInvites).where(eq(teamInvites.userID, this.cls.get('userID')));
	}

	remove(teamID: number, userID: number) {
		return this.db.delete(teamInvites).where(and(eq(teamInvites.teamID, teamID), eq(teamInvites.userID, userID)));
	}
}
