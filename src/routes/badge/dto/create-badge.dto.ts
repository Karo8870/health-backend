import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBadgeDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	name: string;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	description: string;
}
