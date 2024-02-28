import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { AdminGuard } from '../auth/admin.guard';
import { ValidateSubmissionsDto } from './dto/validate-submissions.dto';

@Controller('submission')
export class SubmissionController {
	constructor(private readonly submissionService: SubmissionService) {}

	@Post()
	create(@Body() createSubmissionDto: CreateSubmissionDto) {
		return this.submissionService.create(createSubmissionDto);
	}

	@Get()
	findOwn() {
		return this.submissionService.findOwn();
	}

	@Get('products')
	@UseGuards(AdminGuard)
	findAll() {
		return this.submissionService.findAll();
	}

	@Get('products/:ean')
	@UseGuards(AdminGuard)
	findAllByProduct(@Param('ean') ean: string) {
		return this.submissionService.findAllByProduct(ean);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.submissionService.findOne(+id);
	}

	@Patch('validate')
	@UseGuards(AdminGuard)
	validate(@Body() validateSubmissionsDto: ValidateSubmissionsDto) {
		return this.submissionService.validate(validateSubmissionsDto);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateSubmissionDto: UpdateSubmissionDto
	) {
		return this.submissionService.update(+id, updateSubmissionDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.submissionService.remove(+id);
	}
}
