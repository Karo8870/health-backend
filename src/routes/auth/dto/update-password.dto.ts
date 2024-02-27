import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
	@IsNotEmpty()
	@IsString()
	@Length(8, 50)
	@ApiProperty()
	@Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, {
		message:
			'Password too weak. It must contain at least one uppercase letter, one lowercase letter, and one digit.'
	})
	password: string;
}
