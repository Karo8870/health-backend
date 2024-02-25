import { Module } from '@nestjs/common';
import * as schema from './drizzle/schema';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { AuthModule } from './routes/auth/auth.module';
import { ClsModule } from 'nestjs-cls';
import { ProfileModule } from './routes/profile/profile.module';
import { AuthGuard } from './routes/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ProductModule } from './routes/product/product.module';
import { ReviewModule } from './routes/review/review.module';
import { SubmissionModule } from './routes/submission/submission.module';
import { db_url } from './core/constants';

@Module({
	imports: [
		DrizzlePGModule.register({
			tag: 'DB',
			pg: {
				connection: 'client',
				config: {
					connectionString: db_url
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
		ProfileModule,
		ProductModule,
		ReviewModule,
		SubmissionModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
