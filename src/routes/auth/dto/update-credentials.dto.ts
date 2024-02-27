import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCredentialsDto {
	@IsNotEmpty()
	@IsString()
	@Length(3, 50)
	@ApiProperty()
	user: string;

	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 255)
	@ApiProperty()
	firstName: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 255)
	@ApiProperty()
	lastName: string;
}
