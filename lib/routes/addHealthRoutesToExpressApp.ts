import * as express from 'express';
import { JWT } from 'googleapis-common';
import {
	GeneralizedApiResource,
	GeneralizedApiResourceSpec,
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
		SECRET_CRED_STRIPE_API_KEY?: string | null;
	} & GeneralizedServerVariables & {
			apiResourceSpec: Pick<
				GeneralizedApiResourceSpec,
				'apiResourceCollectionId'
			>;
			corsPolicy: (
				req: express.Request,
				res: express.Response,
				next: express.NextFunction,
			) => void;
			gmailApiServiceAccountPath: string;
			mockApiResource: GeneralizedApiResource;
		},
): void => {
	const {
		SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
		SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID,
		SECRET_CRED_STRIPE_API_KEY,
		SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_EMAIL,
		SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_NAME,
		SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID,
		apiResourceSpec,
		corsPolicy,
		gmailApiServiceAccountPath,
		mockApiResource,
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
					apiResourceSpec,
					mockApiResource,
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

	if (SECRET_CRED_STRIPE_API_KEY) {
		const stripeInstance = getStripeInstance({
			SECRET_CRED_STRIPE_API_KEY,
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
