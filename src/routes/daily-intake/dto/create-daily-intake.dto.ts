import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDailyIntakeDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	data: string;
}
