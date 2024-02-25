import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	ean: string;
}
