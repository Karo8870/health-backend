import { PartialType } from '@nestjs/swagger';
import { CreateDailyIntakeDto } from './create-daily-intake.dto';

export class UpdateDailyIntakeDto extends PartialType(CreateDailyIntakeDto) {}
