import Stripe from 'stripe';
import { PUBLIC_STRIPE_KEY } from '$env/static/public';

export const stripe = new Stripe(PUBLIC_STRIPE_KEY);
