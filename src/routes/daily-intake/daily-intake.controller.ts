import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyIntakeService } from './daily-intake.service';
import { CreateDailyIntakeDto } from './dto/create-daily-intake.dto';
import { UpdateDailyIntakeDto } from './dto/update-daily-intake.dto';

@Controller('daily-intake')
export class DailyIntakeController {
  constructor(private readonly dailyIntakeService: DailyIntakeService) {}

  @Post()
  create(@Body() createDailyIntakeDto: CreateDailyIntakeDto) {
    return this.dailyIntakeService.create(createDailyIntakeDto);
  }

  @Get()
  findAll() {
    return this.dailyIntakeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyIntakeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyIntakeDto: UpdateDailyIntakeDto) {
    return this.dailyIntakeService.update(+id, updateDailyIntakeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyIntakeService.remove(+id);
  }
}
