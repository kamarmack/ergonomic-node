import * as express from 'express';

export const getAuthHeaderBearerToken = <
	TRequestBody,
	TResponseBody,
	TParams,
	TQuery,
>(
	req: express.Request<TRequestBody, TResponseBody, TParams, TQuery>,
) => {
	const authHeader = req.get('Authorization');
	if (!authHeader) throw new Error('No Authorization header');

	const authHeaderParts = authHeader.split(' ');
	if (authHeaderParts.length !== 2)
		throw new Error('Invalid Authorization header');

	const authHeaderScheme = authHeaderParts[0];
	if (authHeaderScheme !== 'Bearer')
		throw new Error('Invalid Authorization header scheme');

	const authHeaderBearerToken = authHeaderParts[1];
	if (!authHeaderBearerToken)
		throw new Error('Empty Authorization header bearer token');

	return authHeaderBearerToken;
};
