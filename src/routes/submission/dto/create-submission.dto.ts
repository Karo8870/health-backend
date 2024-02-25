import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubmissionDto {
	@IsNotEmpty()
	@IsString()
	body: string;

	@IsNotEmpty()
	@IsString()
	ean: string;
}
