import { Module } from '@nestjs/common';
import * as schema from './drizzle/schema';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { AuthModule } from './routes/auth/auth.module';
import { ClsModule } from 'nestjs-cls';
import { ProfileModule } from './routes/profile/profile.module';
import { AuthGuard } from './routes/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
	imports: [
		DrizzlePGModule.register({
			tag: 'DB',
			pg: {
				connection: 'client',
				config: {
					connectionString:
						'postgresql://postgres:test12345@localhost:5432/fiicode'
				}
			},
			config: { schema: { ...schema } }
		}),
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true
			}
		}),
		AuthModule,
		ProfileModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
