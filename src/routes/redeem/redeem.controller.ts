import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { UpdateRedeemDto } from './dto/update-redeem.dto';
import { AdminGuard } from '../auth/admin.guard';
import { PayRedeemDto } from './dto/pay-redeem.dto';

@Controller('redeem')
export class RedeemController {
	constructor(private readonly redeemService: RedeemService) {
	}

	@UseGuards(AdminGuard)
	@Post()
	create(@Body() createRedeemDto: CreateRedeemDto) {
		return this.redeemService.create(createRedeemDto);
	}

	@Get()
	findAll() {
		return this.redeemService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.redeemService.findOne(+id);
	}

	@UseGuards(AdminGuard)
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRedeemDto: UpdateRedeemDto) {
		return this.redeemService.update(+id, updateRedeemDto);
	}

	@UseGuards(AdminGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.redeemService.remove(+id);
	}

	@Patch('redeem')
	redeem(@Body() payRedeemDto: PayRedeemDto) {
		return this.redeemService.redeem(payRedeemDto);
	}
}
