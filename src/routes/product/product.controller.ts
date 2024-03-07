import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ReviewPostDto } from '../post/dto/review-post.dto';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('review/:ean')
	review(@Param('ean') ean: string, @Body() reviewPostDto: ReviewPostDto) {
		return this.productService.review(ean, reviewPostDto);
	}

	@Get('search/:term')
	search(@Param('term') term: string) {
		return this.productService.search(term);
	}

	@Get(':ean')
	findOne(@Param('ean') ean: string) {
		return this.productService.findOne(ean);
	}

	@Delete('review/:ean')
	deleteReview(@Param('ean') ean: string) {
		return this.productService.deleteReview(ean);
	}
}
