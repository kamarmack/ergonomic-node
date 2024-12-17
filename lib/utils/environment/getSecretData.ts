import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export type GeneralizedSecretData = {
	SECRET_CRED_DEPLOYMENT_ENVIRONMENT: 'live' | 'test';
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_AUTH_URI: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_CLIENT_EMAIL: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_CLIENT_ID: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_TOKEN_URI: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_TYPE: string;
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_UNIVERSE_DOMAIN: string;
	SECRET_CRED_FIREBASE_PROJECT_LOCATION: string; // e.g 'us-central1'
	SECRET_CRED_FIREBASE_PROJECT_STORAGE_BUCKET_NAME: string; // e.g 'my-app.appspot.com'
	SECRET_CRED_SERVER_PROTOCOL: 'http' | 'https';
	SECRET_CRED_SMOKE_TEST_RECIPIENT_EMAIL: string;
};

const fileName = fileURLToPath(import.meta.url);
const directoryName = dirname(fileName);

export const getSecretData = <
	T extends GeneralizedSecretData = GeneralizedSecretData,
>(
	envPath: string,
): T | null => {
	try {
		const file = readFileSync(envPath, 'utf-8');
		const lines = file
			.split('SECRET_CRED')
			.map((line, index) => (index === 0 ? line : 'SECRET_CRED' + line))
			.filter((line) => line.includes('='));
		const secrets: Record<string, string | undefined> = {};
		lines.forEach((line) => {
			const [key, ...valueParts] = line.split('=');
			let value = valueParts.join('=').trim().replace(/\\n/g, '\n');

			// Check and remove quotes only if they are at both the start and end of the value
			if (value.startsWith('"') && value.endsWith('"')) {
				value = value.substring(1, value.length - 1);
			}

			const trimmed = key?.trim();

			if (!trimmed) {
				return;
			}

			secrets[trimmed] = value;
		});
		return secrets as T;
	} catch (err) {
		console.error(`Error reading ${directoryName}/../.env`, { err });
		return null;
	}
};
