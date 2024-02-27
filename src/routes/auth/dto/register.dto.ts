import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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

	@IsNotEmpty()
	@IsString()
	@Length(8, 50)
	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
		message:
			'Password too weak. It must contain at least one uppercase letter, one lowercase letter, and one digit.'
	})
	@ApiProperty()
	password: string;
}
