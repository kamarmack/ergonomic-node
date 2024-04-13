// eslint-disable-next-line import/no-unresolved
import { getStorage } from 'firebase-admin/storage';
import { Bucket } from '@google-cloud/storage';

export const getCloudStorageBucket = (storageBucket: string): Bucket => {
	return getStorage().bucket(storageBucket) as unknown as Bucket;
};
