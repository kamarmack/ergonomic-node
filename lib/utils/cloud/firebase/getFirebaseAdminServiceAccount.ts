// eslint-disable-next-line import/no-unresolved
import { ServiceAccount } from 'firebase-admin/app';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';

export const getFirebaseAdminServiceAccount = ({
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_CLIENT_EMAIL,
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY,
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID,
}: GeneralizedSecretData): ServiceAccount => {
	return {
		clientEmail: SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_CLIENT_EMAIL,
		privateKey: SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY,
		projectId: SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID,
	};
};
