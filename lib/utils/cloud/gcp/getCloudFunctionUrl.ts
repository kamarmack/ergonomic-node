import { GoogleAuth } from 'google-auth-library';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';

/**
 * Get the URL of a Google Cloud Function.
 *
 * This function is based on the following example:
 * https://github.com/firebase/functions-samples/blob/d2532012d6089677ced06f6a3f14155953847563/Node/taskqueues-backup-images/functions/index.js#L115
 */
export const getCloudFunctionUrl = async ({
	functionName: name,
	serviceAccountPath,
	SECRET_CRED_FIREBASE_ADMIN_SERVICE_ACCOUNT_PROJECT_ID: projectId,
	SECRET_CRED_FIREBASE_PROJECT_LOCATION: location,
}: GeneralizedSecretData & {
	functionName: string;
	serviceAccountPath: string;
}): Promise<string> => {
	const auth = new GoogleAuth({
		keyFile: serviceAccountPath,
		scopes: 'https://www.googleapis.com/auth/cloud-platform',
	});
	const url =
		'https://cloudfunctions.googleapis.com/v2beta/' +
		`projects/${projectId}/locations/${location}/functions/${name}`;

	const client = await auth.getClient();
	const res = await client.request<{ serviceConfig?: { uri?: string } }>({
		url,
	});
	const uri = res.data?.serviceConfig?.uri;
	if (!uri) {
		throw new Error(`Unable to retrieve uri for function at ${url}`);
	}
	return uri;
};
