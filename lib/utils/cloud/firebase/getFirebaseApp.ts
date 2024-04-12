import {
	App as FirebaseApp,
	initializeApp,
	ServiceAccount,
	cert,
	// eslint-disable-next-line import/no-unresolved
} from 'firebase-admin/app';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';
import { getFirebaseAdminServiceAccount } from 'ergonomic-node/lib//utils/cloud/firebase/getFirebaseAdminServiceAccount.js';

export const getFirebaseApp = (
	credentials: ServiceAccount | GeneralizedSecretData,
): FirebaseApp => {
	const SERVICE_ACCOUNT =
		'clientEmail' in credentials
			? credentials
			: getFirebaseAdminServiceAccount(credentials as GeneralizedSecretData);

	return initializeApp({
		credential: cert(SERVICE_ACCOUNT),
		projectId: SERVICE_ACCOUNT.projectId,
	});
};
