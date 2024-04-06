import { Module } from '@nestjs/common';
import { DailyIntakeService } from './daily-intake.service';
import { DailyIntakeController } from './daily-intake.controller';

@Module({
  controllers: [DailyIntakeController],
  providers: [DailyIntakeService],
})
export class DailyIntakeModule {}
