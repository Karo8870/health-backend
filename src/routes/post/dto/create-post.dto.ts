import { IsEAN, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	content: string;

	@IsOptional()
	@IsEAN()
	@ApiProperty()
	ean: string;

	@IsString()
	@Length(3, 100)
	@ApiProperty()
	title: string;
}
