import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewPostDto {
	@IsNotEmpty()
	@IsBoolean()
	@ApiProperty()
	like: boolean;
}
