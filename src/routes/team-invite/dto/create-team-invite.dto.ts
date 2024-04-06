import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTeamInviteDto {
	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	userID: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	teamID: number;
}
