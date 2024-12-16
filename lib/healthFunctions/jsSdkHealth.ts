import * as express from 'express';
import {
	GeneralizedApiResource,
	GeneralizedApiResourceSpec,
	getGeneralizedError,
} from 'ergonomic';
import { GeneralizedResLocals } from 'ergonomic-node/lib/types/GeneralizedResLocals.js';

export const jsSdkHealthFunction =
	(
		_: express.Request,
		res: express.Response<unknown, GeneralizedResLocals>,
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

				res.locals.json = sdkData;
				return next();
			} catch (err) {
				const message = (err as Error)?.message || 'Unknown error';
				res.locals.json = getGeneralizedError({ message });
				return next();
			}
		})();
	};
