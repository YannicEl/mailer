import { error } from '@sveltejs/kit';
import type { Schema } from 'zod';

export async function validateJsonData<T>(schema: Schema<T>, request: Request): Promise<T> {
	try {
		const json = await request.json();
		return schema.parse(json);
	} catch (err) {
		console.error(err);
		error(422);
	}
}

export async function validateFormData<T>(schema: Schema<T>, request: Request): Promise<T> {
	try {
		const formData = await request.formData();
		const parsedFormData = formDataToObject(formData);
		return schema.parse(parsedFormData);
	} catch (err) {
		console.error(err);
		error(422);
	}
}

export function formDataToObject(
	formData: FormData
): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
	const ret: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

	for (const key of new Set(formData.keys())) {
		const values = formData.getAll(key);
		if (values.length > 1) {
			ret[key] = values;
		} else {
			ret[key] = values[0];
		}
	}

	return ret;
}

export function validateSearchParameters<T>(schema: Schema<T>, searchParams: URLSearchParams): T {
	const params: Record<string, string> = {};

	searchParams.forEach((value, key) => {
		params[key] = value;
	});

	return schema.parse(params);
}
