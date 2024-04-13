// eslint-disable-next-line import/no-unresolved
import { App as FirebaseApp, ServiceAccount } from 'firebase-admin/app';
// eslint-disable-next-line import/no-unresolved
import { getStorage } from 'firebase-admin/storage';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';
import { getFirebaseApp } from 'ergonomic-node/lib/utils/cloud/firebase/getFirebaseApp.js';
import { Bucket } from '@google-cloud/storage';

export const getCloudStorageBucket = (
	credentialsOrFirebaseApp:
		| ServiceAccount
		| GeneralizedSecretData
		| FirebaseApp,
	storageBucket: string = '',
): Bucket => {
	const firebaseApp =
		'clientEmail' in credentialsOrFirebaseApp &&
		'privateKey' in credentialsOrFirebaseApp &&
		'projectId' in credentialsOrFirebaseApp
			? getFirebaseApp(credentialsOrFirebaseApp, storageBucket)
			: 'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_CLIENT_EMAIL' in
					credentialsOrFirebaseApp &&
			  'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY' in
					credentialsOrFirebaseApp &&
			  'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID' in
					credentialsOrFirebaseApp
			? getFirebaseApp(credentialsOrFirebaseApp, storageBucket)
			: (credentialsOrFirebaseApp as FirebaseApp);

	return getStorage().bucket(
		storageBucket ||
			(firebaseApp.options.projectId
				? `${firebaseApp.options.projectId}.appspot.com`
				: undefined),
	) as unknown as Bucket;
};
