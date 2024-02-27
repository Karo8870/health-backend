import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import { comments } from '../../drizzle/schema';
import { ClsService } from 'nestjs-cls';
import { AuthClsStore } from '../auth/auth.guard';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class CommentService {
	constructor(
		@Inject('DB') private db: NodePgDatabase<typeof schema>,
		private cls: ClsService<AuthClsStore>
	) {}

	async create(id: number, createCommentDto: CreateCommentDto) {
		await this.db.insert(comments).values({
			postID: id,
			authorID: this.cls.get('userID'),
			body: createCommentDto.body
		});
	}

	async findMany(id: number) {
		return this.db.query.comments.findMany({ where: eq(comments.postID, id) });
	}

	async update(id: number, updateCommentDto: UpdateCommentDto) {
		await this.db
			.update(comments)
			.set({
				body: updateCommentDto.body
			})
			.where(
				and(eq(comments.id, id), eq(comments.authorID, this.cls.get('userID')))
			);
	}

	async remove(id: number) {
		await this.db
			.delete(comments)
			.where(
				and(eq(comments.id, id), eq(comments.authorID, this.cls.get('userID')))
			);
	}
}
