import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	data: string;
}
