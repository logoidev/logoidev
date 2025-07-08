export type PaymentDestination = 'main' | 'coin' | 'ukraine';

export type CreatePaymentIntentBody = {
	amount: number;
	destination: PaymentDestination;
	coinId?: string | null;
};

export type CreatePaymentIntentResponse = {
	paymentIntentId: string | null;
};

export type UpdatePaymentIntentBody = {
	paymentIntentId: string;
	amount?: number;
	destination?: PaymentDestination;
	coinId?: string | null;
};
