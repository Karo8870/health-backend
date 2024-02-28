import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	ValidateIf
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
	@ValidateIf((o) => o.user == undefined || o.email)
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty()
	email: string;

	@ValidateIf((o) => o.email == undefined || o.user)
	@IsNotEmpty()
	@IsString()
	@Length(3, 50)
	@ApiProperty()
	user: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 50)
	@ApiProperty()
	password: string;
}
