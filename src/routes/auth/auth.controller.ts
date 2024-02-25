import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../../core/public.decorator';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('login')
	signIn(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto);
	}

	@Public()
	@Post('register')
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Delete()
	deleteAccount() {
		return this.authService.deleteAccount();
	}

	@Patch()
	updateCredentials(@Body() updateCredentialsDto: UpdateCredentialsDto) {
		return this.authService.updateCredentials(updateCredentialsDto);
	}

	@Patch()
	updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
		return this.authService.updatePassword(updatePasswordDto);
	}
}
