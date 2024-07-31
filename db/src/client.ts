import type {
	ExtractTablesWithRelations,
	InferInsertModel,
	InferSelectModel,
	Operators,
	SQL,
} from 'drizzle-orm';
import { Relations, getOperators } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';
import type { DrizzleDB } from './schema';

type WhereFunction<Table extends SQLiteTable> = (
	table: Table,
	operators: Operators
) => SQL | undefined;

function _insert<Table extends SQLiteTable>(db: DrizzleDB, table: Table) {
	return async (values: InferInsertModel<Table>): Promise<InferSelectModel<Table>> => {
		const [row] = await db.insert(table).values(values).returning();
		return row as InferSelectModel<Table>;
	};
}

function _update<Table extends SQLiteTable>(db: DrizzleDB, table: Table) {
	return async (
		values: Partial<InferInsertModel<Table>>,
		where: WhereFunction<Table>
	): Promise<InferSelectModel<Table>> => {
		const [row] = await db
			.update(table)
			.set(values)
			.where(where(table, getOperators()))
			.returning();
		return row as InferSelectModel<Table>;
	};
}

function _select<Table extends SQLiteTable>(db: DrizzleDB, table: Table) {
	return async (where: WhereFunction<Table>) => {
		return db.select().from(table).where(where(table, getOperators()));
	};
}

function _delete<Table extends SQLiteTable>(db: DrizzleDB, table: Table) {
	return async (where: WhereFunction<Table>) => {
		db.delete(table).where(where(table, getOperators()));
	};
}

type DbClient<T extends Schema> = {
	[Key in keyof ExtractTablesWithRelations<T>]: T[Key] extends SQLiteTable
		? {
				insert: ReturnType<typeof _insert<T[Key]>>;
				update: ReturnType<typeof _update<T[Key]>>;
				select: ReturnType<typeof _select<T[Key]>>;
				delete: ReturnType<typeof _delete<T[Key]>>;
				query: Key extends keyof DrizzleD1Database<T>['query']
					? DrizzleD1Database<T>['query'][Key]
					: never;
			}
		: never;
} & { drizzle: DrizzleDB };

type DefineDbClientParams<T> = {
	db: DrizzleDB;
	schema: {
		[Key in keyof T]: T[Key];
	};
};

type Schema = Record<string, SQLiteTable | Relations>;

export function defineDbClient<const T extends Schema>({
	db,
	schema,
}: DefineDbClientParams<T>): DbClient<T> {
	const ret: Record<string, any> = {
		drizzle: db,
	};

	for (const key in schema) {
		const table = schema[key];
		if (table instanceof SQLiteTable) {
			ret[key] = {
				insert: _insert(db, table),
				update: _update(db, table),
				delete: _delete(db, table),
				select: _select(db, table),
				query: db.query[key as keyof DrizzleDB['query']],
			};
		}
	}

	return ret as DbClient<T>;
}
