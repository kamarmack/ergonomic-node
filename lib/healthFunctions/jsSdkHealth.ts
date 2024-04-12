import * as express from 'express';
import {
	GeneralizedApiObject,
	ApiObjectSpec,
	GeneralizedResponse,
	getGeneralizedError,
} from 'ergonomic';

export const jsSdkHealthFunction =
	(
		_: express.Request,
		res: express.Response<unknown, GeneralizedResponse>,
		next: express.NextFunction,
		config: {
			apiObjectSpec: ApiObjectSpec;
			mockApiObject: GeneralizedApiObject;
		},
	) =>
	() => {
		return void (async () => {
			try {
				const { apiObjectSpec, mockApiObject } = config;

				// Wait 200ms
				await new Promise((resolve) => setTimeout(resolve, 200));

				const sdkData: {
					collectionId: string;
					mockApiObject: GeneralizedApiObject;
				} = {
					collectionId: apiObjectSpec.apiObjectCollectionId,
					mockApiObject,
				};

				res.locals.data = [sdkData];
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
