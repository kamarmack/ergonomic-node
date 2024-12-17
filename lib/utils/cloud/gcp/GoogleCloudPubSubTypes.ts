import {
	type CloudEvent,
	// eslint-disable-next-line import/no-unresolved
} from 'firebase-functions/v2';
// eslint-disable-next-line import/no-unresolved
import { MessagePublishedData } from 'firebase-functions/v2/pubsub';

export type PubSubEvent<TPayload> = CloudEvent<MessagePublishedData<TPayload>>;
export type PubSubEventHandler<TPayload> = (
	event: PubSubEvent<TPayload>,
) => void | Promise<void>;
