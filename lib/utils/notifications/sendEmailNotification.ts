export type SendEmailNotificationParams = {
	html_body: string;
	recipient_email: string;
	subject: string;
};
export type SendEmailNotificationResponse = {
	emailNotificationId: string | null | undefined;
	success: true;
	threadId: string | null | undefined;
};
