// eslint-disable-next-line import/no-unresolved
import { type Firestore } from 'firebase-admin/firestore';
import * as express from 'express';
import * as stripe from 'stripe';
import { getGeneralizedError } from 'ergonomic';
import {
	GeneralizedSecretData,
	getAuthHeaderBearerToken,
} from 'ergonomic-node/lib/utils/index.js';
import { GeneralizedResLocals } from 'ergonomic-node/lib/types/GeneralizedResLocals.js';

export const stripeApiHealthFunction =
	(
		req: express.Request<unknown, unknown, stripe.Stripe.CustomerCreateParams>,
		res: express.Response<unknown, GeneralizedResLocals>,
		next: express.NextFunction,
		config: Pick<
			GeneralizedSecretData,
			'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID'
		> & {
			db: Firestore;
			stripeInstance: stripe.Stripe;
		},
	) =>
	() => {
		return void (async () => {
			try {
				const {
					SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
					db,
					stripeInstance,
				} = config;

				const authHeaderToken = getAuthHeaderBearerToken(req);

				if (
					authHeaderToken !==
					SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID
				)
					throw new Error('Invalid Authorization header token');

				const stripeParams = req.body;

				if (!stripeParams) throw new Error('No stripeParams');

				const stripeCustomer = await stripeInstance.customers.create(
					stripeParams,
				);

				// Save the stripeCustomer to the `_test` collection
				const testDocRef = db.collection('_test').doc(stripeCustomer.id);
				await testDocRef.set(stripeCustomer);

				res.locals.json = stripeCustomer;
				return next();
			} catch (err) {
				const message = (err as Error)?.message || 'Unknown error';
				res.locals.json = getGeneralizedError({ message });
				return next();
			}
		})();
	};
