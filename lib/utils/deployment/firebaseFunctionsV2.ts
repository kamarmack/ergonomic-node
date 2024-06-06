// eslint-disable-next-line import/no-unresolved
import * as functionsV2 from 'firebase-functions/v2';
// eslint-disable-next-line import/no-unresolved
import { type setGlobalOptions } from 'firebase-functions/v2/options';
import { https, logger } from 'firebase-functions';

const functions = functionsV2 as unknown as {
	https: typeof https;
	logger: typeof logger;
	setGlobalOptions: typeof setGlobalOptions;
};
functionsV2.setGlobalOptions({
	maxInstances: 10,
});

export { functions as firebaseFunctions };
