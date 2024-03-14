import { Injectable } from '@nestjs/common';
import { GeneratePromptDto } from './dto/generate-prompt.dto';
import { HttpService } from '@nestjs/axios';
import { ai_url } from '../../core/constants';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
	constructor(private readonly httpService: HttpService) {}

	async generate(generatePromptDto: GeneratePromptDto) {
		return (
			await firstValueFrom(
				this.httpService.post(ai_url, {
					model: 'food-ai',
					prompt: generatePromptDto.prompt,
					stream: false
				})
			)
		).data.response;
	}
}
