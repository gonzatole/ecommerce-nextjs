import Stripe from 'stripe';
import type { CartItem } from '@/types';
import { formatPrice } from '@/lib/products';

// Lazy init — avoids crash at build time if key is not set
let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'placeholder', {
      apiVersion: '2026-02-25.clover',
    });
  }
  return _stripe;
}

export interface CreateStripeSessionParams {
  items: CartItem[];
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckoutSession({
  items,
  customerEmail,
  successUrl,
  cancelUrl,
}: CreateStripeSessionParams) {
  const stripe = getStripe();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(({ product, quantity }) => ({
    price_data: {
      currency: 'clp',
      product_data: {
        name: product.name,
        description: product.description.slice(0, 200),
        metadata: { productId: product.id, slug: product.slug },
      },
      // Stripe CLP uses integer (no decimals)
      unit_amount: product.price,
    },
    quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      itemCount: items.reduce((s, i) => s + i.quantity, 0).toString(),
    },
    shipping_address_collection: {
      allowed_countries: ['CL'],
    },
    locale: 'es',
    payment_intent_data: {
      description: `TechMarket — ${items.length} producto(s)`,
    },
  });

  return session;
}

export async function getStripeSession(sessionId: string) {
  return getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'payment_intent'],
  });
}
