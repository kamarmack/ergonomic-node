import * as express from 'express';
import {
	GeneralizedApiResource,
	GeneralizedApiResourceSpec,
	GeneralizedResponse,
	getGeneralizedError,
} from 'ergonomic';

export const jsSdkHealthFunction =
	(
		_: express.Request,
		res: express.Response<unknown, GeneralizedResponse>,
		next: express.NextFunction,
		config: {
			apiResourceSpec: Pick<
				GeneralizedApiResourceSpec,
				'apiResourceCollectionId'
			>;
			mockApiResource: GeneralizedApiResource;
		},
	) =>
	() => {
		return void (async () => {
			try {
				const { apiResourceSpec, mockApiResource } = config;

				// Wait 200ms
				await new Promise((resolve) => setTimeout(resolve, 200));

				const sdkData: {
					collectionId: string;
					mockApiResource: GeneralizedApiResource;
				} = {
					collectionId: apiResourceSpec.apiResourceCollectionId,
					mockApiResource,
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
