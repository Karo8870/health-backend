import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateSubmissionsDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	body: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	ean: number;

	@IsNotEmpty()
	@IsArray()
	submissions: number[];
}
