import { PartialType } from '@nestjs/swagger';
import { CreateTeamInviteDto } from './create-team-invite.dto';

export class UpdateTeamInviteDto extends PartialType(CreateTeamInviteDto) {}
