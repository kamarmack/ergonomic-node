// eslint-disable-next-line import/no-unresolved
import { type Firestore } from 'firebase-admin/firestore';
import { GeneralizedResponse, getGeneralizedError } from 'ergonomic';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/index.js';
import * as express from 'express';

export const firebaseHealthFunction =
	(
		req: express.Request,
		res: express.Response<unknown, GeneralizedResponse>,
		next: express.NextFunction,
		config: Pick<
			GeneralizedSecretData,
			'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID'
		> & {
			db: Firestore;
		},
	) =>
	() => {
		return void (async () => {
			try {
				typeof req;

				const { SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID, db } =
					config;
				const testDocSnapshot = await db.collection('_test').doc('0').get();
				const testDocData = testDocSnapshot.data();
				if (!testDocData) throw new Error('No testDocData');

				const firebaseData = {
					success: true,
					SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID,
					testDocData,
				};
				res.locals.data = [firebaseData];
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
