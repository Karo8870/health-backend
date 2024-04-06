import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetBadgeDdo {
	@IsNotEmpty()
	@IsNumber()
	@ApiProperty()
	badgeID: number;
}
