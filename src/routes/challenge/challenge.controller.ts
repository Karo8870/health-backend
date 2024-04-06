import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('challenge')
export class ChallengeController {
	constructor(private readonly challengeService: ChallengeService) {
	}

	@Post()
	@UseGuards(AdminGuard)
	create(@Body() createChallengeDto: CreateChallengeDto) {
		return this.challengeService.create(createChallengeDto);
	}

	@Get()
	findAll() {
		return this.challengeService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.challengeService.findOne(+id);
	}

	@Patch(':id')
	@UseGuards(AdminGuard)
	update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
		return this.challengeService.update(+id, updateChallengeDto);
	}

	@Delete(':id')
	@UseGuards(AdminGuard)
	remove(@Param('id') id: string) {
		return this.challengeService.remove(+id);
	}

	@Get('users/:id')
	getUsers(@Param('id') id: string) {
		return this.challengeService.getUsers(+id);
	}

	@Get('global-users')
	getGlobalUsers() {
		return this.challengeService.getGlobalUsers();
	}
}
