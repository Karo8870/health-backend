import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	ean: string;
}
