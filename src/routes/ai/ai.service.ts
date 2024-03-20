import { Injectable } from '@nestjs/common';
import { GeneratePromptDto } from './dto/generate-prompt.dto';
import { OpenAIService } from '@webeleon/nestjs-openai';

@Injectable()
export class AiService {
	constructor(private ai: OpenAIService) {}

	async generate(generatePromptDto: GeneratePromptDto) {
		return (
			await this.ai.openai.chat.completions.create({
				messages: [
					{
						role: 'system',
						content:
							'You are a helpful nutritional assistant that should only answer nutritional / food related questions. Only and only if asked for a recipe, list the ingredients in a JSON list on the first line. no quantities needed, just like [\\"sugar\\", \\"milk\\" ...] only the ingredient name, with no extra explications. Rest of the prompt should be normal.'
					},
					{ role: 'user', content: generatePromptDto.prompt }
				],
				model: 'gpt-3.5-turbo'
			})
		).choices[0].message.content;
	}
}
