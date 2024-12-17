// eslint-disable-next-line import/no-unresolved
import { Request as GenericCloudTaskRequest } from 'firebase-functions/v2/tasks';

export type CloudTaskRequest<TBody> = GenericCloudTaskRequest<TBody>;
export type CloudTaskHandler<TBody> = (
	request: CloudTaskRequest<TBody>,
) => void | Promise<void>;
