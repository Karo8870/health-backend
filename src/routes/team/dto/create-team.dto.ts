import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	title: string;

	@IsNumber()
	@IsNotEmpty()
	@ApiProperty()
	challengeID: number;
}
