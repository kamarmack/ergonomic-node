import * as stripe from 'stripe';

export const getStripeInstance = ({
	SECRET_CRED_STRIPE_API_KEY_LIVE_MODE,
	SECRET_CRED_STRIPE_API_KEY_TEST_MODE,
}: {
	SECRET_CRED_STRIPE_API_KEY_LIVE_MODE: string;
	SECRET_CRED_STRIPE_API_KEY_TEST_MODE: string;
}) => {
	const SECRET_CRED_STRIPE_API_KEY =
		process.env.NODE_ENV === 'production'
			? SECRET_CRED_STRIPE_API_KEY_LIVE_MODE
			: SECRET_CRED_STRIPE_API_KEY_TEST_MODE;
	const stripeInstance = new stripe.Stripe(SECRET_CRED_STRIPE_API_KEY);
	return stripeInstance;
};
