import { JWT } from 'googleapis-common';
import { google } from 'googleapis';
import { GeneralizedServerVariables } from 'ergonomic-node/lib/utils/environment/index.js';

export const getGoogleAuthJwtInstanceForGmailApi = ({
	SERVER_VAR_GMAIL_NOTIFICATIONS_USER_ID: gmailUserId,
	scopes = ['https://www.googleapis.com/auth/gmail.send'],
	serviceAccountPath,
}: GeneralizedServerVariables & {
	scopes?: string[];
	serviceAccountPath: string;
}): JWT => {
	const googleAuthJwt = google.auth.JWT;
	const googleAuthJwtInstanceForGmailApi = new googleAuthJwt({
		keyFile: serviceAccountPath,
		scopes,
		subject: gmailUserId,
	});
	return googleAuthJwtInstanceForGmailApi;
};
