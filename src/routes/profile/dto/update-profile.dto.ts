import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
	@IsNotEmpty()
	@ApiProperty()
	data: string;
}
