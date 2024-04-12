import * as R from 'ramda';
import * as express from 'express';
import { GeneralizedResponse, getGeneralizedError } from 'ergonomic';
import { getExpressInvocationStatusCode } from 'ergonomic-node/lib/utils/middleware/getExpressInvocationStatusCode.js';

export const sendExpressResponse =
	() =>
	(_: express.Request, res: express.Response, next: express.NextFunction) => {
		const generalizedResponse = R.pick(
			['data', 'errors'],
			res.locals,
		) as GeneralizedResponse;

		if (
			generalizedResponse.data.length === 0 &&
			generalizedResponse.errors.length === 0
		) {
			generalizedResponse.errors.push(
				getGeneralizedError({
					category: 'doc.does-not-exist',
				}),
			);
		}

		res
			.status(getExpressInvocationStatusCode(generalizedResponse))
			.json(generalizedResponse);
		return next();
	};
