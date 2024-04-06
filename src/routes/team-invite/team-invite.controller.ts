import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamInviteService } from './team-invite.service';
import { CreateTeamInviteDto } from './dto/create-team-invite.dto';
import { UpdateTeamInviteDto } from './dto/update-team-invite.dto';

@Controller('team-invite')
export class TeamInviteController {
  constructor(private readonly teamInviteService: TeamInviteService) {}

  @Post()
  create(@Body() createTeamInviteDto: CreateTeamInviteDto) {
    return this.teamInviteService.create(createTeamInviteDto);
  }

  @Get()
  findAll() {
    return this.teamInviteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamInviteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamInviteDto: UpdateTeamInviteDto) {
    return this.teamInviteService.update(+id, updateTeamInviteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamInviteService.remove(+id);
  }
}
