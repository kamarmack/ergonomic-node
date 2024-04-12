import * as util from 'util';
import * as R from 'ramda';
import * as express from 'express';
import { GeneralizedResponse } from 'ergonomic/index.js';
import { firebaseFunctions } from 'ergonomic-node/lib/utils/deployment/index.js';
import { getExpressInvocationStatusCode } from 'ergonomic-node/lib/utils/middleware/getExpressInvocationStatusCode.js';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';

const getExpressInvocationLog = ({
	data,
	errors,
	req,
}: { req: express.Request } & GeneralizedResponse) => {
	const log = {
		request: R.pick(
			[
				'baseUrl',
				'body',
				'cookies',
				'headers',
				'hostname',
				'httpVersion',
				'ip',
				'ips',
				'method',
				'originalUrl',
				'params',
				'path',
				'protocol',
				'query',
				'url',
			],
			req,
		),
		response: {
			data: data,
			errors: errors,
		},
		status_code: getExpressInvocationStatusCode({ errors }),
	} as const;

	if (log.request?.headers?.authorization) {
		// Mask the authorization header
		log.request.headers.authorization =
			log.request.headers.authorization.replace(
				/^(Bearer )(.+)$/,
				'$1**********',
			);
	}

	return log;
};

export const logExpressInvocation =
	(config: Pick<GeneralizedSecretData, 'SECRET_CRED_SERVER_PROTOCOL'>) =>
	(
		req: express.Request,
		res: express.Response<unknown, GeneralizedResponse>,
		_: express.NextFunction,
	) => {
		const { SECRET_CRED_SERVER_PROTOCOL } = config;
		const resLocals = res.locals;
		const log = getExpressInvocationLog({ ...resLocals, req });

		if (SECRET_CRED_SERVER_PROTOCOL === 'http') {
			console.log(
				util.inspect(log, { showHidden: false, depth: null, colors: true }),
			);
			return;
		}
		firebaseFunctions.logger.log(log);
	};
