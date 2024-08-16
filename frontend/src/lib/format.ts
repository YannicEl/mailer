import { getLocal } from './locale';

export function formatDate(data: Date): string {
	return new Intl.DateTimeFormat(getLocal()).format(data);
}
