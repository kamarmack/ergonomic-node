import { default as ky } from 'ky-universal';
import { GeneralizedResponse } from 'ergonomic';

export type SendEmailNotificationParams = {
	html_body: string;
	recipient_email: string;
	subject: string;
};
export type SendEmailNotificationResponseData = {
	emailNotificationId: string | null | undefined;
	success: true;
	threadId: string | null | undefined;
};
export type SendEmailNotificationResponse =
	GeneralizedResponse<SendEmailNotificationResponseData> & {
		readonly data: [SendEmailNotificationResponseData];
	};
export const sendEmailNotification = async (
	prefixUrl: string,
	bearerToken: string,
	params: SendEmailNotificationParams,
): Promise<SendEmailNotificationResponse> => {
	try {
		const data = await ky
			.post('v0/health/notifications', {
				json: params,
				prefixUrl,
				headers: {
					Authorization: `Bearer ${bearerToken}`,
				},
			})
			.json<SendEmailNotificationResponse>();
		return data;
	} catch (err) {
		console.error(err);
		return Promise.reject(err);
	}
};
