import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Post(':id')
	create(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
		return this.commentService.create(+id, createCommentDto);
	}

	@Get(':id')
	findMany(@Param('id') id: string) {
		return this.commentService.findMany(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
		return this.commentService.update(+id, updateCommentDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.commentService.remove(+id);
	}
}
