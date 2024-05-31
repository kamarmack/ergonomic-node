import {
	App as FirebaseApp,
	initializeApp,
	ServiceAccount,
	cert,
	// eslint-disable-next-line import/no-unresolved
} from 'firebase-admin/app';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';
import { getFirebaseAdminServiceAccount } from 'ergonomic-node/lib//utils/cloud/firebase/getFirebaseAdminServiceAccount.js';

let firebaseAppInstance: FirebaseApp | null = null;

export const getFirebaseApp = (
	credentials: ServiceAccount | GeneralizedSecretData,
	storageBucket: string = '',
): FirebaseApp => {
	if (!firebaseAppInstance) {
		const SERVICE_ACCOUNT =
			'clientEmail' in credentials &&
			'privateKey' in credentials &&
			'projectId' in credentials
				? credentials
				: getFirebaseAdminServiceAccount(credentials as GeneralizedSecretData);

		firebaseAppInstance = initializeApp({
			credential: cert(SERVICE_ACCOUNT),
			projectId: SERVICE_ACCOUNT.projectId,
			storageBucket:
				storageBucket ||
				(SERVICE_ACCOUNT.projectId
					? `${SERVICE_ACCOUNT.projectId}.appspot.com`
					: undefined),
		});
	}

	return firebaseAppInstance;
};
