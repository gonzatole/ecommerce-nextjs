import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

/**
 * Webhook IPN de MercadoPago.
 * MP envía una notificación POST cuando cambia el estado de un pago.
 * Documentación: https://www.mercadopago.cl/developers/es/docs/your-integrations/notifications/ipn
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      type?: string;
      action?: string;
      data?: { id?: string };
    };

    // Solo procesamos notificaciones de pagos
    if (body.type !== 'payment' && body.action !== 'payment.updated') {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 });
    }

    // Consultar el detalle del pago a la API de MP para obtener el external_reference y status
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'MP not configured' }, { status: 500 });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!mpRes.ok) {
      console.error('[MP webhook] Error consultando pago:', mpRes.status);
      return NextResponse.json({ error: 'MP API error' }, { status: 502 });
    }

    const payment = await mpRes.json() as {
      status: string;
      external_reference?: string;
    };

    const externalRef = payment.external_reference;
    if (!externalRef) {
      return NextResponse.json({ received: true });
    }

    if (payment.status === 'approved') {
      await db.order.updateMany({
        where: { providerRef: externalRef, provider: 'mercadopago', status: 'pending' },
        data: { status: 'paid' },
      });
    } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
      await db.order.updateMany({
        where: { providerRef: externalRef, provider: 'mercadopago', status: 'pending' },
        data: { status: 'failed' },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[MP webhook] Error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
