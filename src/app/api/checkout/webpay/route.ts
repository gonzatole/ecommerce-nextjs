import { NextRequest, NextResponse } from 'next/server';
import { createWebpayTransaction } from '@/lib/payments/webpay';
import type { CartItem } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { items: CartItem[]; sessionId: string };
    const { items, sessionId } = body;

    if (!items?.length) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    const amount = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    // buyOrder: max 26 chars, único por transacción
    const buyOrder = `TM-${Date.now()}`.slice(0, 26);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const returnUrl = `${appUrl}/api/checkout/webpay/confirm`;

    const { token, url } = await createWebpayTransaction({
      buyOrder,
      sessionId: sessionId.slice(0, 61),
      amount,
      returnUrl,
    });

    return NextResponse.json({ token, url });
  } catch (err) {
    console.error('[WebPay] init error:', err);
    return NextResponse.json(
      { error: 'Error al iniciar pago con WebPay' },
      { status: 500 },
    );
  }
}
