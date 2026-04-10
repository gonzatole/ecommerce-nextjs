import { NextRequest, NextResponse } from 'next/server';
import { createMercadoPagoPreference } from '@/lib/payments/mercadopago';
import { db } from '@/lib/prisma';
import type { CartItem } from '@/types';

export async function POST(req: NextRequest) {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'MercadoPago no está configurado. Agrega MERCADOPAGO_ACCESS_TOKEN al entorno.' },
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
    const externalRef = `TM-${Date.now()}`;

    // Crear orden pendiente con externalRef como referencia de proveedor
    await db.order.create({
      data: {
        provider: 'mercadopago',
        status: 'pending',
        customerEmail: email ?? null,
        total,
        providerRef: externalRef,
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

    const preference = await createMercadoPagoPreference({
      items,
      payerEmail: email,
      successUrl: `${appUrl}/checkout/success?provider=mercadopago&external_reference=${externalRef}`,
      failureUrl: `${appUrl}/checkout/cancel?provider=mercadopago`,
      pendingUrl: `${appUrl}/checkout/success?provider=mercadopago&status=pending`,
      externalReference: externalRef,
    });

    // En producción: preference.init_point
    // En sandbox: preference.sandbox_init_point
    const isSandbox = process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-');
    const url = isSandbox ? preference.sandbox_init_point : preference.init_point;

    return NextResponse.json({ url });
  } catch (err) {
    console.error('[MercadoPago] preference error:', err);
    return NextResponse.json(
      { error: 'Error al crear preferencia de pago' },
      { status: 500 },
    );
  }
}
