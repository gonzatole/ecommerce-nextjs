import { NextRequest, NextResponse } from 'next/server';
import { commitWebpayTransaction } from '@/lib/payments/webpay';
import { db } from '@/lib/prisma';

/**
 * Transbank redirige aquí mediante un POST con el token en el body (form data).
 * Debemos confirmar (commit) la transacción y redirigir al usuario.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get('token_ws') as string | null;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    if (!token) {
      // Usuario canceló el pago en Transbank
      return NextResponse.redirect(`${appUrl}/checkout/cancel?provider=webpay`);
    }

    const result = await commitWebpayTransaction(token);
    const buyOrder = (result as { buyOrder: string }).buyOrder ?? '';
    const responseCode = (result as { responseCode: number }).responseCode;
    const amount = (result as { amount: number }).amount ?? 0;

    // responseCode === 0 → APROBADO
    if (responseCode === 0) {
      // Actualizar orden a pagada
      await db.order.updateMany({
        where: { providerRef: buyOrder, provider: 'webpay', status: 'pending' },
        data: { status: 'paid' },
      });

      const params = new URLSearchParams({
        provider: 'webpay',
        buyOrder,
        amount: String(amount),
      });
      return NextResponse.redirect(`${appUrl}/checkout/success?${params.toString()}`);
    }

    // Pago rechazado — marcar orden como fallida
    await db.order.updateMany({
      where: { providerRef: buyOrder, provider: 'webpay' },
      data: { status: 'failed' },
    });

    return NextResponse.redirect(`${appUrl}/checkout/cancel?provider=webpay&code=${responseCode}`);
  } catch (err) {
    console.error('[WebPay] confirm error:', err);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    return NextResponse.redirect(`${appUrl}/checkout/cancel?provider=webpay&error=1`);
  }
}

// WebPay también puede llegar con GET si el usuario cancela antes de pagar
export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const token = req.nextUrl.searchParams.get('token_ws');
  if (!token) {
    return NextResponse.redirect(`${appUrl}/checkout/cancel?provider=webpay`);
  }
  return POST(req);
}
