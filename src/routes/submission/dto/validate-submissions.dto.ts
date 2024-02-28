import { IsArray, IsEAN, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateSubmissionsDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	body: string;

	@IsNotEmpty()
	@IsEAN()
	@ApiProperty()
	ean: string;

	@IsNotEmpty()
	@IsArray()
	submissions: number[];
}
