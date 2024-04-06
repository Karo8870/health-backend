import { Injectable } from '@nestjs/common';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { UpdateRedeemDto } from './dto/update-redeem.dto';

@Injectable()
export class RedeemService {
  create(createRedeemDto: CreateRedeemDto) {
    return 'This action adds a new redeem';
  }

  findAll() {
    return `This action returns all redeem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} redeem`;
  }

  update(id: number, updateRedeemDto: UpdateRedeemDto) {
    return `This action updates a #${id} redeem`;
  }

  remove(id: number) {
    return `This action removes a #${id} redeem`;
  }
}
