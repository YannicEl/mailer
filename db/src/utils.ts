export function generateId(): string {
	return crypto.randomUUID().replace(/-/g, '');
}

export function generateBrandedId(brand: string) {
	return `${brand}_${generateId()}`;
}
