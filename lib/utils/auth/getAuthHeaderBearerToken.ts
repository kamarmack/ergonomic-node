import * as express from 'express';

export const getAuthHeaderBearerToken = (
	req: express.Request<unknown, unknown, unknown, unknown>,
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
