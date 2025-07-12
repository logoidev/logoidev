<script lang="ts">
  import { Elements, PaymentElement, AddressElement } from 'svelte-stripe';
  import { onMount, createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';
  import { getStripe } from '../Payment/utils/stripe';
  import type Stripe from 'stripe';
  import Spinner from '../Spinner.svelte';

  // Props
  export let destination: 'main' | 'coin' | 'ukraine' | 'donation' = 'main';
  export let to = 'Logoi';
  export let cta = '';
  export let give = false;
  export let coinId: string | null = null;
  export let initialAmount: number | null = null;
  export let currency = 'USD';
  export let customerCountry = 'US';
  export let customerRegion: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  // Component state
  let stripe: Stripe | undefined;
  let elements: any;
  let clientSecret: string | null = null;
  let processing = false;
  let success = false;
  let error: string | undefined;
  let amount = initialAmount || 1;
  let donatedAmount = 0;
  let isCustomAmountShown = false;
  let thankYouShown = false;

  // Payment data
  let priceBreakdown: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
  } | null = null;

  // Form validation
  let paymentFormValid = false;
  let addressFormValid = false;
  let emailValid = false;
  let customerEmail = '';

  $: isFormValid = paymentFormValid && addressFormValid && emailValid;

  interface PaymentRequest {
    amount?: number;
    currency: string;
    destination: typeof destination;
    coinId?: string;
    customerEmail?: string;
    returnUrl: string;
    customerInfo: {
      country: string;
      region?: string;
      isBusinessCustomer: boolean;
    };
  }

  interface PaymentResponse {
    clientSecret: string;
    paymentIntentId: string;
    priceBreakdown: {
      subtotal: number;
      discount: number;
      tax: number;
      total: number;
      currency: string;
    };
    expiresAt: string;
  }

  const createPaymentIntent = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
    const response = await fetch('/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  const initializeStripe = async () => {
    try {
      error = undefined;
      
      const stripeInstance = await getStripe();
      if (!stripeInstance) {
        throw new Error('Failed to load Stripe');
      }
      stripe = stripeInstance;

      // Create payment intent with enhanced data
      const paymentData: PaymentRequest = {
        amount: initialAmount ? initialAmount * 100 : undefined, // Convert to cents
        currency,
        destination,
        coinId,
        customerEmail: customerEmail || undefined,
        returnUrl: browser ? window.location.origin : 'https://logoi.dev',
        customerInfo: {
          country: customerCountry,
          region: customerRegion,
          isBusinessCustomer: false, // Could be made configurable
        },
      };

      const paymentResponse = await createPaymentIntent(paymentData);
      clientSecret = paymentResponse.clientSecret;
      priceBreakdown = paymentResponse.priceBreakdown;

      // Update amount based on server response
      amount = Math.round(paymentResponse.priceBreakdown.total / 100);

    } catch (err) {
      console.error('Stripe initialization failed:', err);
      error = err instanceof Error ? err.message : 'Failed to initialize payment';
    }
  };

  const handlePaymentElementChange = (event: any) => {
    paymentFormValid = event.detail.complete;
  };

  const handleAddressElementChange = (event: any) => {
    addressFormValid = event.detail.complete;
  };

  const handleEmailChange = () => {
    emailValid = customerEmail.length > 0 && customerEmail.includes('@');
  };

  const submit = async () => {
    if (!stripe || !elements || !isFormValid) {
      return;
    }

    if (processing) return;
    processing = true;
    error = undefined;

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: browser ? window.location.href : 'https://logoi.dev',
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }

      if (result.paymentIntent?.status === 'succeeded') {
        success = true;
        donatedAmount = result.paymentIntent.amount / 100;
        
        dispatch('success', {
          result,
          amount: donatedAmount,
          priceBreakdown,
        });
      }
    } catch (err) {
      console.error('Payment confirmation failed:', err);
      error = err instanceof Error ? err.message : 'Payment failed';
    } finally {
      processing = false;
    }
  };

  const onCustomAmountConfirm = async () => {
    const input = document.getElementById('amount') as HTMLInputElement;
    const newAmount = input?.valueAsNumber ?? 1;

    if (newAmount && newAmount !== amount) {
      amount = newAmount;
      // Reinitialize with new amount
      await initializeStripe();
    }

    isCustomAmountShown = false;

    if (newAmount > 1) {
      thankYouShown = true;
    }
  };

  // Format currency for display
  const formatCurrency = (amountInCents: number, currencyCode: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
      }).format(amountInCents / 100);
    } catch {
      return `${currencyCode} ${(amountInCents / 100).toFixed(2)}`;
    }
  };

  onMount(() => {
    if (browser) {
      initializeStripe();
    }
  });
</script>

<div class="flex justify-center font-sans">
  <form on:submit|preventDefault={submit} class="flex flex-col gap-4 text-center max-w-md w-full">
    <!-- Header -->
    <h2 class="text-xl font-semibold mb-2">
      {cta || `${give ? 'Give to' : 'Pay'} ${to}`}
    </h2>

    <!-- Loading State -->
    {#if !stripe || !clientSecret}
      <div class="flex flex-col items-center gap-2">
        <Spinner />
        <p class="text-sm text-gray-600">Initializing payment...</p>
      </div>

    <!-- Success State -->
    {:else if success}
      <div class="text-center">
        <div class="text-green-700 text-xl mb-2">Thank you! ❤️</div>
        <div class="text-gray-500 mb-4">
          {formatCurrency(donatedAmount * 100, priceBreakdown?.currency || currency)} received
        </div>
        
        {#if priceBreakdown}
          <div class="text-sm text-gray-600 space-y-1">
            <div>Subtotal: {formatCurrency(priceBreakdown.subtotal, priceBreakdown.currency)}</div>
            {#if priceBreakdown.discount > 0}
              <div>Discount: -{formatCurrency(priceBreakdown.discount, priceBreakdown.currency)}</div>
            {/if}
            {#if priceBreakdown.tax > 0}
              <div>Tax: {formatCurrency(priceBreakdown.tax, priceBreakdown.currency)}</div>
            {/if}
          </div>
        {/if}

        <slot name="reward" />
      </div>

    <!-- Thank You Message for Custom Amount -->
    {:else if thankYouShown}
      <div class="flex flex-col gap-2">
        <div class="text-xl">Thank you for trying to give more!</div>
        <div>We appreciate your generosity.</div>
        <div>Unfortunately we can't accept custom amounts yet.</div>
        <div>Please email us though! We have a gift for you.</div>
        <div class="mt-2">
          <a 
            href="mailto:vlad@logoi.dev?subject=Want to give more to {to}"
            class="text-blue-600 hover:underline"
          >
            Contact us
          </a>
        </div>
      </div>

    <!-- Payment Form -->
    {:else}
      <!-- Email Input -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          bind:value={customerEmail}
          on:input={handleEmailChange}
          placeholder="your@email.com"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Price Breakdown -->
      {#if priceBreakdown}
        <div class="bg-gray-50 p-3 rounded-md text-sm mb-4">
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(priceBreakdown.subtotal, priceBreakdown.currency)}</span>
          </div>
          {#if priceBreakdown.discount > 0}
            <div class="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-{formatCurrency(priceBreakdown.discount, priceBreakdown.currency)}</span>
            </div>
          {/if}
          {#if priceBreakdown.tax > 0}
            <div class="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(priceBreakdown.tax, priceBreakdown.currency)}</span>
            </div>
          {/if}
          <hr class="my-2" />
          <div class="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(priceBreakdown.total, priceBreakdown.currency)}</span>
          </div>
        </div>
      {/if}

      <!-- Stripe Elements -->
      {#key clientSecret}
        <Elements
          {stripe}
          {clientSecret}
          theme="stripe"
          labels="floating"
          variables={{ colorPrimary: '#0070f3' }}
          bind:elements
        >
          <div class="mb-4">
            <PaymentElement on:change={handlePaymentElementChange} />
          </div>
          
          <div class="mb-4">
            <AddressElement 
              options={{ mode: 'billing' }}
              on:change={handleAddressElementChange}
            />
          </div>
        </Elements>
      {/key}

      <!-- Error Display -->
      {#if error}
        <div class="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      {/if}

      <!-- Submit Button -->
      <button
        type="submit"
        disabled={processing || !isFormValid}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium
               disabled:bg-gray-400 disabled:cursor-not-allowed
               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {#if processing}
          <span class="flex items-center justify-center gap-2">
            <Spinner />
            Processing...
          </span>
        {:else}
          {give ? 'Give' : 'Pay'} {priceBreakdown ? formatCurrency(priceBreakdown.total, priceBreakdown.currency) : `$${amount}`}
        {/if}
      </button>

      <!-- Custom Amount -->
      {#if isCustomAmountShown}
        <div class="mt-4 p-3 border rounded-md">
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
            Custom Amount (USD)
          </label>
          <div class="flex gap-2">
            <input
              id="amount"
              type="number"
              value={amount}
              min="1"
              max="10000"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              on:click={onCustomAmountConfirm}
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Confirm
            </button>
          </div>
        </div>
      {:else}
        <button
          type="button"
          on:click={() => { isCustomAmountShown = true; }}
          class="text-gray-500 text-sm hover:underline"
        >
          Custom amount
        </button>
      {/if}
    {/if}
  </form>
</div>