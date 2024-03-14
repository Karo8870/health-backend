import { Body, Controller, Get, Param } from '@nestjs/common';
import { AiService } from './ai.service';
import { GeneratePromptDto } from './dto/generate-prompt.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get()
  findMany(@Body() generatePromptDto: GeneratePromptDto) {
    return this.aiService.generate(generatePromptDto);
  }
}
