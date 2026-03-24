import Link from 'next/link';
import { XCircle, RotateCcw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{ provider?: string; code?: string; error?: string }>;
}

const PROVIDER_LABELS: Record<string, string> = {
  stripe: 'Stripe',
  webpay: 'WebPay Plus',
  mercadopago: 'MercadoPago',
};

const WEBPAY_ERRORS: Record<string, string> = {
  '-1': 'Rechazo de la transacción',
  '-2': 'Transacción debe reintentarse',
  '-3': 'Error en transacción',
  '-4': 'Rechazo del emisor',
  '-5': 'Rechazo por error de tasa',
  '-6': 'Excede límite de reintentos',
  '-7': 'Excede límite diario',
  '-8': 'Rubro no autorizado',
};

export default async function CheckoutCancelPage({ searchParams }: Props) {
  const params = await searchParams;
  const provider = params.provider ?? '';
  const providerLabel = PROVIDER_LABELS[provider] ?? 'el proveedor de pago';
  const errorCode = params.code ?? '';
  const errorMsg = errorCode ? (WEBPAY_ERRORS[errorCode] ?? `Código ${errorCode}`) : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black mb-2">Pago no completado</h1>
          <p className="text-muted-foreground">
            {params.error
              ? `Ocurrió un error con ${providerLabel}.`
              : `Cancelaste el pago en ${providerLabel} o fue rechazado.`}
          </p>
          {errorMsg && (
            <p className="mt-2 text-sm text-red-500 font-medium">{errorMsg}</p>
          )}
        </div>

        {/* Info box */}
        <div className="bg-muted/40 rounded-2xl p-6 text-sm text-muted-foreground">
          <p>Tu carrito <strong className="text-foreground">no fue cobrado</strong>. Puedes intentarlo nuevamente o elegir otro método de pago.</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/40">
            <RotateCcw className="h-5 w-5 text-primary" />
            <p className="font-medium">Reintentar</p>
            <p className="text-xs text-muted-foreground text-center">Vuelve al checkout y elige otro método</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/40">
            <Headphones className="h-5 w-5 text-primary" />
            <p className="font-medium">¿Necesitas ayuda?</p>
            <p className="text-xs text-muted-foreground text-center">Contacta a soporte al cliente</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/checkout">
            <Button size="lg" className="w-full sm:w-auto px-8">
              <RotateCcw className="h-4 w-4 mr-2" /> Volver al checkout
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              Ver productos
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
