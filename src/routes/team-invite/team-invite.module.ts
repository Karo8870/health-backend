import { Module } from '@nestjs/common';
import { TeamInviteService } from './team-invite.service';
import { TeamInviteController } from './team-invite.controller';

@Module({
  controllers: [TeamInviteController],
  providers: [TeamInviteService],
})
export class TeamInviteModule {}
