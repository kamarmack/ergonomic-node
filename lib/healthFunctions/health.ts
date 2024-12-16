import * as express from 'express';
import { getGeneralizedError } from 'ergonomic';
import { GeneralizedResLocals } from 'ergonomic-node/lib/types/GeneralizedResLocals.js';

export const healthFunction =
	(
		_: express.Request,
		res: express.Response<unknown, GeneralizedResLocals>,
		next: express.NextFunction,
	) =>
	() => {
		return void (async () => {
			try {
				// Wait 200ms
				await new Promise((resolve) => setTimeout(resolve, 200));

				res.locals.json = { success: true };
				return next();
			} catch (err) {
				const message = (err as Error)?.message || 'Unknown error';
				res.locals.json = getGeneralizedError({ message });
				return next();
			}
		})();
	};
