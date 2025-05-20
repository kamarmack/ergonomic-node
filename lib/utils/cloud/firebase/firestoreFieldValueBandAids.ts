// eslint-disable-next-line import/no-unresolved
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Creates a Firestore FieldValue sentinel that appends one or more strings
 * to an array field without duplicating existing values.
 *
 * **WARNING**: Return value is a Firestore FieldValue, not an actual string[].
 * This function is meant to be used inside Firestore `.update()` calls.
 *
 * @param items - A string or array of strings to append to the array field.
 * @returns A FieldValue representing the array union operation.
 *
 * @example
 * ```ts
 * firestore().collection('users').doc('...').update({
 *   tags: appendToArrayField(['admin', 'editor']),
 * });
 * ```
 */
export function appendToArrayField(items: string | string[]): string[] {
	const arr = Array.isArray(items) ? items : [items];
	const update = FieldValue.arrayUnion(...arr);
	return update as unknown as string[];
}

/**
 * Creates a Firestore FieldValue sentinel that removes one or more strings
 * from an array field if they exist.
 *
 * **WARNING**: Return value is a Firestore FieldValue, not an actual string[].
 * This function is meant to be used inside Firestore `.update()` calls.
 *
 * @param items - A string or array of strings to remove from the array field.
 * @returns A FieldValue representing the array remove operation.
 *
 * @example
 * ```ts
 * firestore().collection('users').doc('...').update({
 *   onboarding_tasks: removeFromArrayField('update_profile_picture'),
 * });
 * ```
 */
export function removeFromArrayField(items: string | string[]): string[] {
	const arr = Array.isArray(items) ? items : [items];
	const update = FieldValue.arrayRemove(...arr);
	return update as unknown as string[];
}

/**
 * Creates a Firestore FieldValue sentinel that increments a numeric field
 * by a specified amount.
 *
 * **WARNING**: Return value is a Firestore FieldValue, not an actual number.
 * This function is meant to be used inside Firestore `.update()` calls.
 *
 * @param n - The amount to add to the numeric field (positive or negative).
 * @returns A FieldValue representing the increment operation.
 *
 * @example
 * ```ts
 * firestore().collection('stats').doc('pageViews').update({
 *   count: addToNumericField(1),
 * });
 * ```
 */
export function addToNumericField(n: number): number {
	const update = FieldValue.increment(n);
	return update as unknown as number;
}

/**
 * Creates a Firestore FieldValue sentinel that decrements a numeric field
 * by a specified amount.
 *
 * **WARNING**: Return value is a Firestore FieldValue, not an actual number.
 * This function is meant to be used inside Firestore `.update()` calls.
 *
 * @param n - The amount to subtract from the numeric field (must be positive).
 * @returns A FieldValue representing the decrement operation.
 *
 * @example
 * ```ts
 * firestore().collection('inventory').doc('...').update({
 *   stock: subtractFromNumericField(1),
 * });
 * ```
 */
export function subtractFromNumericField(n: number): number {
	const additiveInverse = -n;
	return addToNumericField(additiveInverse);
}
