import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePromptDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	prompt: string;
}
