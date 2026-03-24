import { NextRequest, NextResponse } from 'next/server';
import { commitWebpayTransaction } from '@/lib/payments/webpay';

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

    // responseCode === 0 → APROBADO
    if ((result as { responseCode: number }).responseCode === 0) {
      const params = new URLSearchParams({
        provider: 'webpay',
        buyOrder: (result as { buyOrder: string }).buyOrder ?? '',
        amount: String((result as { amount: number }).amount ?? ''),
      });
      return NextResponse.redirect(`${appUrl}/checkout/success?${params.toString()}`);
    }

    return NextResponse.redirect(`${appUrl}/checkout/cancel?provider=webpay&code=${(result as { responseCode: number }).responseCode}`);
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
