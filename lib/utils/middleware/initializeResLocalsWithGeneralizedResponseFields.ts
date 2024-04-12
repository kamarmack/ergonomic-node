import * as express from 'express';

export const initializeResLocalsWithGeneralizedResponseFields =
	() =>
	(_: express.Request, res: express.Response, next: express.NextFunction) => {
		res.locals = { ...res.locals, data: [], errors: [] };
		return next();
	};
