import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCredentialsDto {
	@IsNotEmpty()
	@IsString()
	@Length(3, 50)
	user: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 255)
	firstName: string;

	@IsNotEmpty()
	@IsString()
	@Length(1, 255)
	lastName: string;
}
