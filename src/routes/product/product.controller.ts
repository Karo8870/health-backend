import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ReviewProductDto } from './dto/review-product.dto';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('vote/:ean')
	review(@Param('ean') ean: string, @Body() reviewProductDto: ReviewProductDto) {
		return this.productService.review(ean, reviewProductDto);
	}

	@Get('recommend')
	recommend(@Body() recommendProductDto: any) {
		return this.productService.recommend(recommendProductDto);
	}

	@Get('search/:term')
	search(@Param('term') term: string) {
		return this.productService.search(term);
	}

	@Get(':ean')
	findOne(@Param('ean') ean: string) {
		return this.productService.findOne(ean);
	}

	@Delete('vote/:ean')
	deleteReview(@Param('ean') ean: string) {
		return this.productService.deleteReview(ean);
	}
}
