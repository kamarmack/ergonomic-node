// eslint-disable-next-line import/no-unresolved
import { App as FirebaseApp, ServiceAccount } from 'firebase-admin/app';
// eslint-disable-next-line import/no-unresolved
import { type Messaging, getMessaging } from 'firebase-admin/messaging';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';
import { getFirebaseApp } from 'ergonomic-node/lib//utils/cloud/firebase/getFirebaseApp.js';

export const getFirebaseMessaging = (
	credentialsOrFirebaseApp:
		| ServiceAccount
		| GeneralizedSecretData
		| FirebaseApp,
): Messaging => {
	const firebaseApp =
		'clientEmail' in credentialsOrFirebaseApp &&
		'privateKey' in credentialsOrFirebaseApp &&
		'projectId' in credentialsOrFirebaseApp
			? getFirebaseApp(credentialsOrFirebaseApp)
			: 'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_CLIENT_EMAIL' in
					credentialsOrFirebaseApp &&
			  'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY' in
					credentialsOrFirebaseApp &&
			  'SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID' in
					credentialsOrFirebaseApp
			? getFirebaseApp(credentialsOrFirebaseApp)
			: (credentialsOrFirebaseApp as FirebaseApp);

	return getMessaging(firebaseApp);
};
