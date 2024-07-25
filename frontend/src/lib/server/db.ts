import type { DB } from '@mailer/db';
import { getDb as _getDb } from '@mailer/db';

export function getDb(D1: D1Database): DB {
	return _getDb(D1);
}
