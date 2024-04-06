import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PayRedeemDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	causeID: number;
}
