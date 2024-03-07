import { IsEAN, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
	@IsNotEmpty()
	@ApiProperty()
	body: string;

	@IsNotEmpty()
	@IsEAN()
	@ApiProperty()
	ean: string;
}
