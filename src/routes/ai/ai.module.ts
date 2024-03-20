import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Models, OpenAIModule } from '@webeleon/nestjs-openai';
import { OPENAI_KEY } from '../../core/constants';

@Module({
	imports: [
		OpenAIModule.forRoot({
			apiKey: OPENAI_KEY,
			model: Models.GPT4
		})
	],
	controllers: [AiController],
	providers: [AiService]
})
export class AiModule {}
