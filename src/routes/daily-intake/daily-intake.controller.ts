import { Body, Controller, Get, Post } from '@nestjs/common';
import { DailyIntakeService } from './daily-intake.service';
import { CreateDailyIntakeDto } from './dto/create-daily-intake.dto';

@Controller('daily-intake')
export class DailyIntakeController {
	constructor(private readonly dailyIntakeService: DailyIntakeService) {
	}

	@Post()
	create(@Body() createDailyIntakeDto: CreateDailyIntakeDto) {
		return this.dailyIntakeService.create(createDailyIntakeDto);
	}

	@Get()
	findAll() {
		return this.dailyIntakeService.findAll();
	}
}
