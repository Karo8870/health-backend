import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReviewPostDto } from './dto/review-post.dto';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post()
	create(@Body() createReviewDto: CreatePostDto) {
		return this.postService.create(createReviewDto);
	}

	@Post('review/:id')
	review(@Param('id') id: string, @Body() reviewPostDto: ReviewPostDto) {
		return this.postService.review(+id, reviewPostDto);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.postService.findOne(+id);
	}

	@Get('product/:ean')
	findMany(@Param('ean') ean: string) {
		return this.postService.findMany(+ean);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateReviewDto: UpdatePostDto) {
		return this.postService.update(+id, updateReviewDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.postService.remove(+id);
	}

	@Delete('review/:id')
	deleteReview(@Param('id') id: string) {
		return this.postService.deleteReview(+id);
	}
}
