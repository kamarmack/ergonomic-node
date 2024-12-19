import * as express from 'express';
import { getGeneralizedError } from 'ergonomic';
import {
	GeneralizedResLocals,
	isResLocalsJsonError,
} from 'ergonomic-node/lib/types/GeneralizedResLocals.js';

export const sendExpressResponse =
	() =>
	(_: express.Request, res: express.Response, next: express.NextFunction) => {
		const resLocals = res.locals as GeneralizedResLocals;
		const resLocalsJson =
			resLocals.json ??
			getGeneralizedError({
				type: 'request.unknown-error',
			});

		if (isResLocalsJsonError(resLocalsJson)) {
			res.status(Number(resLocalsJson.error.status_code)).json(resLocalsJson);
		} else {
			res.status(200).json(resLocalsJson);
		}

		return next();
	};
