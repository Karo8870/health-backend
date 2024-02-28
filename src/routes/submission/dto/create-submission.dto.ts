import { IsEAN, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	body: string;

	@IsNotEmpty()
	@IsEAN()
	@ApiProperty()
	ean: string;
}
