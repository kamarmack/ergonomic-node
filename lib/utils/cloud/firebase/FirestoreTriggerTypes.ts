import {
	type QueryDocumentSnapshot,
	type FirestoreEvent,
	// eslint-disable-next-line import/no-unresolved
} from 'firebase-functions/v2/firestore';

export type FirestoreTriggerEvent<TParams> = FirestoreEvent<
	QueryDocumentSnapshot | undefined,
	TParams
>;
export type FirestoreTriggerHandler<TParams> = (
	event: FirestoreTriggerEvent<TParams>,
) => void | Promise<void>;
