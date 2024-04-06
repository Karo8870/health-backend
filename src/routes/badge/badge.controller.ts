import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { GetBadgeDdo } from './dto/get-badge.tdo';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('badge')
export class BadgeController {
	constructor(private readonly badgeService: BadgeService) {
	}

	@UseGuards(AdminGuard)
	@Post()
	create(@Body() createBadgeDto: CreateBadgeDto) {
		return this.badgeService.create(createBadgeDto);
	}

	@Post('get')
	getBadge(@Body() getBadgeDto: GetBadgeDdo) {
		return this.badgeService.getBadge(getBadgeDto);
	}

	@Get()
	findAll() {
		return this.badgeService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.badgeService.findOne(+id);
	}

	@UseGuards(AdminGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateBadgeDto: UpdateBadgeDto) {
		return this.badgeService.update(+id, updateBadgeDto);
	}

	@UseGuards(AdminGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.badgeService.remove(+id);
	}
}
