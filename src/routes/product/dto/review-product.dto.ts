import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewProductDto {
	@IsNotEmpty()
	@IsBoolean()
	@ApiProperty()
	vote: boolean;
}
