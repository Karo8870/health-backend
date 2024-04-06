import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChallengeDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	startDate: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	endDate: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	unit: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	organizer: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	goal: number;
}
