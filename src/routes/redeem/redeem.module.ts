import { Module } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { RedeemController } from './redeem.controller';

@Module({
  controllers: [RedeemController],
  providers: [RedeemService],
})
export class RedeemModule {}
