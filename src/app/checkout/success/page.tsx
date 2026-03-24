import Link from 'next/link';
import { CheckCircle2, Package, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  searchParams: Promise<{
    provider?: string;
    session_id?: string;
    buyOrder?: string;
    amount?: string;
    external_reference?: string;
    status?: string;
  }>;
}

const PROVIDER_LABELS: Record<string, string> = {
  stripe: 'Stripe',
  webpay: 'WebPay Plus',
  mercadopago: 'MercadoPago',
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const provider = params.provider ?? 'desconocido';
  const isPending = params.status === 'pending';
  const providerLabel = PROVIDER_LABELS[provider] ?? provider;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Icon */}
        <div className="flex justify-center">
          <div className={`h-20 w-20 rounded-full flex items-center justify-center ${
            isPending
              ? 'bg-amber-100 dark:bg-amber-900/30'
              : 'bg-emerald-100 dark:bg-emerald-900/30'
          }`}>
            <CheckCircle2 className={`h-10 w-10 ${isPending ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black mb-2">
            {isPending ? '¡Pago en proceso!' : '¡Compra exitosa!'}
          </h1>
          <p className="text-muted-foreground">
            {isPending
              ? 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.'
              : `Tu pago fue procesado correctamente a través de ${providerLabel}.`}
          </p>
        </div>

        {/* Details */}
        <div className="bg-muted/40 rounded-2xl p-6 text-sm space-y-3 text-left">
          {params.buyOrder && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Número de orden</span>
              <span className="font-mono font-medium">{params.buyOrder}</span>
            </div>
          )}
          {params.session_id && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID de sesión</span>
              <span className="font-mono font-medium text-xs truncate max-w-48">{params.session_id}</span>
            </div>
          )}
          {params.amount && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto pagado</span>
              <span className="font-bold">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(params.amount))}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Método de pago</span>
            <span className="font-medium">{providerLabel}</span>
          </div>
        </div>

        {/* Next steps */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/40">
            <Mail className="h-5 w-5 text-primary" />
            <p className="font-medium">Confirmación</p>
            <p className="text-xs text-muted-foreground text-center">Recibirás un email de confirmación</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/40">
            <Package className="h-5 w-5 text-primary" />
            <p className="font-medium">Despacho</p>
            <p className="text-xs text-muted-foreground text-center">Tu pedido será enviado en 24-48 horas</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Seguir comprando <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              Ir al inicio
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
