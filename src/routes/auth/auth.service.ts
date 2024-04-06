import {
	ConflictException,
	Inject,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { preferences, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from './auth.guard';
import { UpdateCredentialsDto } from './dto/update-credentials.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

export interface JWTTokenResponse {
	access_token: string;
}

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	async signIn(signInDto: SignInDto): Promise<JWTTokenResponse> {
		const user = await this.db.query.users.findFirst({
			where: signInDto.email
				? eq(users.email, signInDto.email)
				: eq(users.user, signInDto.user)
		});

		if (!user || !(await compare(signInDto.password, user.password))) {
			throw new UnauthorizedException();
		}

		return {
			access_token: await this.jwtService.signAsync({
				id: user.id,
				username: user.user
			})
		};
	}

	async register(registerDto: RegisterDto): Promise<any> {
		try {
			const [user] = await this.db
				.insert(users)
				.values({
					firstName: registerDto.firstName,
					lastName: registerDto.lastName,
					user: registerDto.user,
					email: registerDto.email,
					password: await hash(registerDto.password, 10)
				})
				.returning({
					id: users.id
				});

			await this.db.insert(preferences).values({
				userID: user.id,
				data: {},
				personal: {}
			});
		} catch (e) {
			if (e.code === '23505') {
				throw new ConflictException(e.detail);
			}

			console.log(e);

			throw new InternalServerErrorException();
		}
	}

	async deleteAccount(): Promise<any> {
		await this.db.delete(users).where(eq(users.id, this.cls.get('userID')));
	}

	async updateCredentials(
		updateCredentialsDto: UpdateCredentialsDto
	): Promise<any> {
		try {
			await this.db
				.update(users)
				.set({
					firstName: updateCredentialsDto.firstName,
					lastName: updateCredentialsDto.lastName,
					user: updateCredentialsDto.user,
					email: updateCredentialsDto.email
				})
				.where(eq(users.id, this.cls.get('userID')));
		} catch (e) {
			if (e.code === '23505') {
				throw new ConflictException(e.detail);
			}

			throw new InternalServerErrorException();
		}
	}

	async updatePassword(updatePasswordDto: UpdatePasswordDto) {
		await this.db
			.update(users)
			.set({
				password: await hash(updatePasswordDto.password, 10)
			})
			.where(eq(users.id, this.cls.get('userID')));
	}
}
