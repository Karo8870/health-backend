import { Injectable } from '@nestjs/common';
import { CreateTeamInviteDto } from './dto/create-team-invite.dto';
import { UpdateTeamInviteDto } from './dto/update-team-invite.dto';

@Injectable()
export class TeamInviteService {
  create(createTeamInviteDto: CreateTeamInviteDto) {
    return 'This action adds a new teamInvite';
  }

  findAll() {
    return `This action returns all teamInvite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamInvite`;
  }

  update(id: number, updateTeamInviteDto: UpdateTeamInviteDto) {
    return `This action updates a #${id} teamInvite`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamInvite`;
  }
}
