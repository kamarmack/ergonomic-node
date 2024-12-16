import * as express from 'express';
import { getEnum, getGeneralizedError } from 'ergonomic';
import { GeneralizedResLocals } from 'ergonomic-node/lib/types/GeneralizedResLocals.js';

export const ergonomicHealthFunction =
	(
		req: express.Request,
		res: express.Response<unknown, GeneralizedResLocals>,
		next: express.NextFunction,
	) =>
	() => {
		return void (async () => {
			const fruitEnum = getEnum(['apple', 'banana', 'cherry']);
			type Fruit = keyof typeof fruitEnum.obj;
			try {
				typeof req;

				// Wait 200ms
				await new Promise((resolve) => setTimeout(resolve, 200));

				const fruitData: { fruit: Record<Fruit, Fruit> } = {
					fruit: fruitEnum.obj,
				};
				res.locals.json = fruitData;
				return next();
			} catch (err) {
				const message = (err as Error)?.message || 'Unknown error';
				res.locals.json = getGeneralizedError({ message });
				return next();
			}
		})();
	};
