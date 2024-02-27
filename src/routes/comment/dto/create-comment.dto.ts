import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	body: string;
}
