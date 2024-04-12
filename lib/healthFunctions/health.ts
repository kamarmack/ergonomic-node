import * as express from 'express';
import { GeneralizedResponse, getGeneralizedError } from 'ergonomic';

export const healthFunction =
	(
		_: express.Request,
		res: express.Response<unknown, GeneralizedResponse>,
		next: express.NextFunction,
	) =>
	() => {
		return void (async () => {
			try {
				// Wait 200ms
				await new Promise((resolve) => setTimeout(resolve, 200));

				res.locals.data = [{ success: true }];
				return next();
			} catch (err) {
				const message = (err as Error)?.message || 'Unknown error';
				res.locals.errors = res.locals.errors?.length
					? res.locals.errors
					: [getGeneralizedError({ message })];
				return next();
			}
		})();
	};
