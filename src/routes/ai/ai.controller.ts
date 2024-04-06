import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeneratePromptDto } from './dto/generate-prompt.dto';
import { PremiumGuard } from '../auth/premium.guard';

@Controller('ai')
export class AiController {
	constructor(private readonly aiService: AiService) {
	}

	@UseGuards(PremiumGuard)
	@Post()
	findMany(@Body() generatePromptDto: GeneratePromptDto) {
		return this.aiService.generate(generatePromptDto);
	}
}
