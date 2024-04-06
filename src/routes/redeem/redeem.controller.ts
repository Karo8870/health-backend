import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RedeemService } from './redeem.service';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { UpdateRedeemDto } from './dto/update-redeem.dto';

@Controller('redeem')
export class RedeemController {
  constructor(private readonly redeemService: RedeemService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRedeemDto: UpdateRedeemDto) {
    return this.redeemService.update(+id, updateRedeemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.redeemService.remove(+id);
  }
}
