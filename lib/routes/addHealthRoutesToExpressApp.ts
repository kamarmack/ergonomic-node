import * as express from 'express';
import { JWT } from 'googleapis-common';
import {
	GeneralizedApiObject,
	ApiObjectSpec,
	GeneralizedResponse,
} from 'ergonomic';
import {
	ergonomicHealthFunction,
	firebaseHealthFunction,
	healthFunction,
	jsSdkHealthFunction,
	notificationsHealthFunction,
	stripeApiHealthFunction,
} from 'ergonomic-node/lib/healthFunctions/index.js';
import {
	GeneralizedSecretData,
	GeneralizedServerVariables,
	SendEmailNotificationResponse,
	getFirestoreDB,
	getGoogleAuthJwtInstanceForGmailApi,
	getStripeInstance,
} from 'ergonomic-node/lib/utils/index.js';

export const addHealthRoutesToExpressApp = (
	app: express.Express,
	params: GeneralizedSecretData & {
		SECRET_CRED_STRIPE_API_KEY_LIVE_MODE: string | null;
		SECRET_CRED_STRIPE_API_KEY_TEST_MODE: string | null;
	} & GeneralizedServerVariables & {
			apiObjectSpec: Pick<ApiObjectSpec, 'apiObjectCollectionId'>;
			corsPolicy: (
				req: express.Request,
				res: express.Response,
				next: express.NextFunction,
			) => void;
			gmailApiServiceAccountPath: string;
			mockApiObject: GeneralizedApiObject;
		},
): void => {
	const {
		SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
		SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID,
		SECRET_CRED_STRIPE_API_KEY_LIVE_MODE,
		SECRET_CRED_STRIPE_API_KEY_TEST_MODE,
		SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_EMAIL,
		SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_NAME,
		SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID,
		apiObjectSpec,
		corsPolicy,
		gmailApiServiceAccountPath,
		mockApiObject,
	} = params;

	app.options('*/v0/health/ok', corsPolicy);
	app.post(
		'*/v0/health/ok',
		(req, res: express.Response<unknown, GeneralizedResponse>, next) => {
			corsPolicy(req, res, healthFunction(req, res, next));
		},
	);

	app.options('*/v0/health/ergonomic', corsPolicy);
	app.post(
		'*/v0/health/ergonomic',
		(req, res: express.Response<unknown, GeneralizedResponse>, next) => {
			corsPolicy(req, res, ergonomicHealthFunction(req, res, next));
		},
	);

	app.options('*/v0/health/js-sdk', corsPolicy);
	app.post(
		'*/v0/health/js-sdk',
		(req, res: express.Response<unknown, GeneralizedResponse>, next) => {
			corsPolicy(
				req,
				res,
				jsSdkHealthFunction(req, res, next, {
					apiObjectSpec,
					mockApiObject,
				}),
			);
		},
	);

	const db = getFirestoreDB(params);

	app.options('*/v0/health/firebase', corsPolicy);
	app.post(
		'*/v0/health/firebase',
		(req, res: express.Response<unknown, GeneralizedResponse>, next) => {
			corsPolicy(
				req,
				res,
				firebaseHealthFunction(req, res, next, {
					SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID,
					db,
				}),
			);
		},
	);

	const googleAuthJwtInstanceForGmailApi: JWT =
		getGoogleAuthJwtInstanceForGmailApi({
			...params,
			serviceAccountPath: gmailApiServiceAccountPath,
		});
	app.options('*/v0/health/notifications', corsPolicy);
	app.post(
		'*/v0/health/notifications',
		(
			req,
			res: express.Response<unknown, SendEmailNotificationResponse>,
			next,
		) => {
			corsPolicy(
				req,
				res,
				notificationsHealthFunction(req, res, next, {
					SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_EMAIL,
					SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_NAME,
					SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID,
					SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
					db,
					googleAuthJwtInstanceForGmailApi,
				}),
			);
		},
	);

	if (
		SECRET_CRED_STRIPE_API_KEY_LIVE_MODE &&
		SECRET_CRED_STRIPE_API_KEY_TEST_MODE
	) {
		const stripeInstance = getStripeInstance({
			SECRET_CRED_STRIPE_API_KEY_LIVE_MODE,
			SECRET_CRED_STRIPE_API_KEY_TEST_MODE,
		});
		app.options('*/v0/health/stripe-api', corsPolicy);
		app.post(
			'*/v0/health/stripe-api',
			(req, res: express.Response<unknown, GeneralizedResponse>, next) => {
				corsPolicy(
					req,
					res,
					stripeApiHealthFunction(req, res, next, {
						SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
						stripeInstance,
						db,
					}),
				);
			},
		);
	}
};
