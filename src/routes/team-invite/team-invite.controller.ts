import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TeamInviteService } from './team-invite.service';
import { CreateTeamInviteDto } from './dto/create-team-invite.dto';

@Controller('team-invite')
export class TeamInviteController {
	constructor(private readonly teamInviteService: TeamInviteService) {
	}

	@Post()
	create(@Body() createTeamInviteDto: CreateTeamInviteDto) {
		return this.teamInviteService.create(createTeamInviteDto);
	}

	@Get()
	findAll() {
		return this.teamInviteService.findAll();
	}

	@Delete(':teamID/:userID')
	remove(@Param('teamID') teamID: string, @Param('userID') userID: string) {
		return this.teamInviteService.remove(+teamID, +userID);
	}
}
