import { GeneralizedResponse } from 'ergonomic/index.js';

export const getExpressInvocationStatusCode = ({
	errors,
}: Pick<GeneralizedResponse, 'errors'>) => {
	if (errors.length) {
		if (errors[0]?.error?.status_code == null) {
			return 500;
		}
		return errors[0]?.error?.status_code;
	}

	return 200;
};
