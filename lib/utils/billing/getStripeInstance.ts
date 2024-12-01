import * as stripe from 'stripe';

export const getStripeInstance = ({
	SECRET_CRED_STRIPE_API_KEY,
}: {
	SECRET_CRED_STRIPE_API_KEY: string;
}) => {
	const stripeInstance = new stripe.Stripe(SECRET_CRED_STRIPE_API_KEY);
	return stripeInstance;
};
