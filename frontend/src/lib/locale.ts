import { browser } from '$app/environment';
import { useEvent } from './context';

export function getLocal(): string[] {
	if (browser) {
		return [...navigator.languages];
	} else {
		const event = useEvent();
		const acceptLanguage = event.request.headers.get('accept-language') ?? '';
		return acceptLanguage.split(',').map((lang) => lang?.split(';')[0]);
	}
}
