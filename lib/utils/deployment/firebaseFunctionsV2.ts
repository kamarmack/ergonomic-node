// eslint-disable-next-line import/no-unresolved
import * as functionsV2 from 'firebase-functions/v2';

const functions = functionsV2;
functionsV2.setGlobalOptions({
	maxInstances: 10,
});

export { functions as firebaseFunctions };
