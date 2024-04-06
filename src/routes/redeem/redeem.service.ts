import { Inject, Injectable } from '@nestjs/common';
import { CreateRedeemDto } from './dto/create-redeem.dto';
import { UpdateRedeemDto } from './dto/update-redeem.dto';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { redeems, users } from '../../drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { PayRedeemDto } from './dto/pay-redeem.dto';

@Injectable()
export class RedeemService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {
	}

	create(createRedeemDto: CreateRedeemDto) {
		return this.db.insert(redeems).values({
			title: createRedeemDto.title,
			description: createRedeemDto.description,
			cost: createRedeemDto.cost,
			reward: createRedeemDto.reward
		});
	}

	findAll() {
		return this.db.select().from(redeems);
	}

	findOne(id: number) {
		return this.db.select().from(redeems).where(eq(redeems.id, id));
	}

	update(id: number, updateRedeemDto: UpdateRedeemDto) {
		return this.db.update(redeems).set({
			title: updateRedeemDto.title,
			description: updateRedeemDto.description
		}).where(eq(redeems.id, id));
	}

	remove(id: number) {
		return this.db.delete(redeems).where(eq(redeems.id, id));
	}

	async redeem(payRedeemDto: PayRedeemDto) {
		console.log(await this.db.update(users).set({
			points: sql`${users.points} - 5`
		}).where(eq(users.id, this.cls.get('userID'))).returning({
			p: users.points
		}));

		console.log(await this.db.update(redeems).set({
			points: sql`${redeems.points} + 5`
		}).where(eq(redeems.id, payRedeemDto.causeID)).returning({
			p: redeems.points
		}));
	}
}
