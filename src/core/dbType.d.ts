export type dbType<
	T extends {
		$inferSelect: {
			[key: string]: any;
		};
	}
> = Promise<T['$inferSelect']>;