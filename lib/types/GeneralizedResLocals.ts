import { GeneralizedError } from 'ergonomic';

export type GeneralizedResLocals<TData = unknown, TError = GeneralizedError> = {
	json?: TData | TError;
};

export const isResLocalsJsonError = (json: unknown): json is GeneralizedError =>
	(json as GeneralizedError)?.error != null;
