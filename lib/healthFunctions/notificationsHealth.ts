// eslint-disable-next-line import/no-unresolved
import { type Firestore } from 'firebase-admin/firestore';
import { v4 } from 'uuid';
import * as express from 'express';
import { JWT } from 'googleapis-common';
import { google } from 'googleapis';
import { getGeneralizedError } from 'ergonomic';
import {
	SendEmailNotificationParams,
	SendEmailNotificationResponse,
	GeneralizedSecretData,
	GeneralizedServerVariables,
	getAuthHeaderBearerToken,
} from 'ergonomic-node/lib/utils/index.js';
import { GeneralizedResLocals } from 'ergonomic-node/lib/types/index.js';

export const notificationsHealthFunction =
	(
		req: express.Request<unknown, unknown, SendEmailNotificationParams>,
		res: express.Response<
			unknown,
			GeneralizedResLocals<SendEmailNotificationResponse>
		>,
		next: express.NextFunction,
		config: Pick<
			GeneralizedSecretData,
			'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID'
		> &
			Pick<
				GeneralizedServerVariables,
				| 'SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_EMAIL'
				| 'SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_NAME'
				| 'SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID'
			> & {
				db: Firestore;
				googleAuthJwtInstanceForGmailApi: JWT | null;
			},
	) =>
	() => {
		return void (async () => {
			try {
				const {
					SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_EMAIL,
					SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_NAME,
					SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID,
					SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
					db,
					googleAuthJwtInstanceForGmailApi,
				} = config;

				if (googleAuthJwtInstanceForGmailApi == null)
					throw new Error('No googleAuthJwtInstanceForGmailApi');

				const authHeaderToken = getAuthHeaderBearerToken(req);

				if (
					authHeaderToken !==
					SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID
				)
					throw new Error('Invalid Authorization header token');

				const {
					html_body: htmlBody,
					recipient_email: recipientEmail,
					subject,
				} = req.body;
				const senderName = SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_NAME;
				const senderEmail = SERVER_VAR_GMAIL_NOTIFICATIONS_SEND_FROM_EMAIL;

				const gmail = google.gmail({
					version: 'v1',
					auth: googleAuthJwtInstanceForGmailApi,
				});

				const emailContent = [
					`Content-Type: text/html; charset="UTF-8"`,
					`MIME-Version: 1.0`,
					`Content-Transfer-Encoding: 7bit`,
					`to: ${recipientEmail}`,
					`from: ${senderName} <${senderEmail}>`,
					`subject: ${subject}`,
					'',
					htmlBody,
				].join('\n');

				const message = Buffer.from(emailContent)
					.toString('base64')
					.replace(/\+/g, '-')
					.replace(/\//g, '_')
					.replace(/=+$/, '');

				const result = await gmail.users.messages.send({
					userId: SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID,
					requestBody: {
						raw: message,
					},
				});

				const {
					data: { id: emailNotificationId, threadId },
				} = result;

				// Save the stripeCustomer to the `_test` collection
				const testDocRef = db
					.collection('_test')
					.doc(emailNotificationId ?? v4());
				await testDocRef.set({
					emailNotificationId,
					htmlBody,
					recipientEmail,
					subject,
					threadId,
					timestamp: new Date().toISOString(),
				});

				res.locals.json = {
					success: true,
					threadId,
					emailNotificationId,
				};
				return next();
			} catch (err) {
				const message = (err as Error)?.message || 'Unknown error';
				res.locals.json = getGeneralizedError({ message });
				return next();
			}
		})();
	};
