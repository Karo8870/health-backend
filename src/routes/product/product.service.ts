import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { products } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProductService {
	constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

	create(createProductDto: CreateProductDto) {
		return this.db.insert(products).values({
			ean: createProductDto.ean
		});
	}

	findOne(ean: string) {
		return this.db.query.products.findFirst({
			where: eq(products.ean, ean)
		});
	}
}
