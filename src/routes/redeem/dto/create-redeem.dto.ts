import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRedeemDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	cost: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	reward: string;
}
