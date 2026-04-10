import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/payments/stripe';
import { db } from '@/lib/prisma';
import type { CartItem } from '@/types';

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe no está configurado. Agrega STRIPE_SECRET_KEY al entorno.' },
      { status: 503 },
    );
  }

  try {
    const body = await req.json() as { items: CartItem[]; email?: string };
    const { items, email } = body;

    if (!items?.length) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    // Crear orden pendiente antes de redirigir a Stripe
    const order = await db.order.create({
      data: {
        provider: 'stripe',
        status: 'pending',
        customerEmail: email ?? null,
        total,
        items: {
          create: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
        },
      },
    });

    const session = await createStripeCheckoutSession({
      items,
      customerEmail: email,
      successUrl: `${appUrl}/checkout/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/checkout/cancel?provider=stripe`,
    });

    // Guardar el Stripe session ID como referencia
    await db.order.update({
      where: { id: order.id },
      data: { providerRef: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe] checkout error:', err);
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 },
    );
  }
}
