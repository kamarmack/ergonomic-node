import * as util from 'util';
import * as R from 'ramda';
import * as express from 'express';
import { getGeneralizedError } from 'ergonomic';
import { firebaseFunctions } from 'ergonomic-node/lib/utils/deployment/index.js';
import { GeneralizedSecretData } from 'ergonomic-node/lib/utils/environment/index.js';
import {
	GeneralizedResLocals,
	isResLocalsJsonError,
} from 'ergonomic-node/lib/types/GeneralizedResLocals.js';

const getExpressInvocationLog = ({
	json,
	req,
}: { req: express.Request } & GeneralizedResLocals) => {
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
		response: json,
		status_code: isResLocalsJsonError(json)
			? Number(json.error.status_code)
			: 200,
	} as const;

	if (log.request?.headers?.authorization) {
		// Mask the authorization header
		log.request.headers.authorization =
			log.request.headers.authorization.replace(
				/^(Bearer )(.+)$/,
				'$1**********',
			);
	}

	const obfuscateRequestBodyPropertiesHeader = req.get(
		'X-Obfuscate-Request-Body-Properties',
	);
	if (obfuscateRequestBodyPropertiesHeader) {
		const properties = obfuscateRequestBodyPropertiesHeader.split(',');
		const obfuscatedBody = R.mapObjIndexed((value, key) =>
			properties.includes(key) ? '**********' : value,
		)((req.body as Record<string, unknown>) ?? {});
		log.request.body = obfuscatedBody;
	}

	return {
		...log,
		message: `${log.status_code}: ${log.request.method} ${log.request.originalUrl}`,
	};
};

export const logExpressInvocation =
	(config: Pick<GeneralizedSecretData, 'SECRET_CRED_SERVER_PROTOCOL'>) =>
	(
		req: express.Request,
		res: express.Response<unknown, GeneralizedResLocals>,
		_: express.NextFunction,
	) => {
		const { SECRET_CRED_SERVER_PROTOCOL } = config;
		const resLocals = res.locals;
		const log = getExpressInvocationLog({
			json:
				resLocals.json ??
				getGeneralizedError({
					type: 'request.unknown-error',
				}),
			req,
		});

		if (SECRET_CRED_SERVER_PROTOCOL === 'http') {
			console.log(
				util.inspect(log, { showHidden: false, depth: null, colors: true }),
			);
			return;
		}
		firebaseFunctions.logger.log(log);
	};
