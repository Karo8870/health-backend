import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyPremiumDto {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	expire: number;
}
