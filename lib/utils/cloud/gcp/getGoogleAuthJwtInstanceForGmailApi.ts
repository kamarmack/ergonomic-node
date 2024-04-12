import { JWT } from 'googleapis-common';
import { google } from 'googleapis';
import { GeneralizedServerVariables } from 'ergonomic-node/lib/utils/environment/getServerVariables.js';

export const getGoogleAuthJwtInstanceForGmailApi = ({
	SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID: gmailUserId,
	serviceAccountPath,
}: GeneralizedServerVariables & {
	serviceAccountPath: string;
}): JWT => {
	const googleAuthJwt = google.auth.JWT;
	const googleAuthJwtInstanceForGmailApi = new googleAuthJwt({
		keyFile: serviceAccountPath,
		scopes: ['https://www.googleapis.com/auth/gmail.send'],
		subject: gmailUserId,
	});
	return googleAuthJwtInstanceForGmailApi;
};
