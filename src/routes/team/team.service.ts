import { Inject, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AuthClsStore } from '../auth/auth.guard';
import { ClsService } from 'nestjs-cls';
import * as schema from '../../drizzle/schema';
import { teams, usersToTeams } from '../../drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class TeamService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	create(createTeamDto: CreateTeamDto) {
		return this.db.insert(teams).values({
			title: createTeamDto.title,
			challengeID: createTeamDto.challengeID
		});
	}

	findAll() {
		return this.db.query.usersToTeams.findMany({
			where: eq(usersToTeams.userID, this.cls.get('userID')),
			with: {
				team: true
			}
		});
	}

	findOne(id: number) {
		return this.db.query.teams.findFirst({
			where: and(eq(usersToTeams.teamID, id), eq(usersToTeams.userID, this.cls.get('userID')))
		});
	}

	update(id: number, updateTeamDto: UpdateTeamDto) {
		return this.db.update(teams).set({
			title: updateTeamDto.title
		}).where(and(eq(teams.id, id), eq(teams.creatorID, this.cls.get('userID'))));
	}

	remove(id: number) {
		return this.db.delete(teams).where(and(eq(teams.id, id), eq(teams.creatorID, this.cls.get('userID'))));
	}
}