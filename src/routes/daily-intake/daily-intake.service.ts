import { Injectable } from '@nestjs/common';
import { CreateDailyIntakeDto } from './dto/create-daily-intake.dto';
import { UpdateDailyIntakeDto } from './dto/update-daily-intake.dto';

@Injectable()
export class DailyIntakeService {
  create(createDailyIntakeDto: CreateDailyIntakeDto) {
    return 'This action adds a new dailyIntake';
  }

  findAll() {
    return `This action returns all dailyIntake`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyIntake`;
  }

  update(id: number, updateDailyIntakeDto: UpdateDailyIntakeDto) {
    return `This action updates a #${id} dailyIntake`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyIntake`;
  }
}
