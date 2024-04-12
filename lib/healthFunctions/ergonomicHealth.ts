import * as express from 'express';
import { GeneralizedResponse, getEnum, getGeneralizedError } from 'ergonomic';

export const ergonomicHealthFunction =
	(
		req: express.Request,
		res: express.Response<unknown, GeneralizedResponse>,
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
				res.locals.data = [fruitData];
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
