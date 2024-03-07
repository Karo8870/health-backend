import { IsArray, IsEAN, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateSubmissionsDto {
	@IsNotEmpty()
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
