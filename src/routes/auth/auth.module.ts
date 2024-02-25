import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../core/constants';

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: jwtConstants.key,
			signOptions: { expiresIn: jwtConstants.expiresIn }
		})
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
