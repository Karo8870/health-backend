import { IsEAN, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	body: string;

	@IsNotEmpty()
	@IsEAN()
	@ApiProperty()
	ean: string;
}
