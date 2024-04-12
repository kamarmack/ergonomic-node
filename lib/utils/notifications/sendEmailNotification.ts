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
