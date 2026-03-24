'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { formatPrice, productGradients } from '@/lib/products';
import { PaymentMethodSelector, type PaymentMethod } from '@/components/checkout/payment-method-selector';

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  address: z.string().min(5, 'Dirección muy corta'),
  city: z.string().min(2, 'Ciudad requerida'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('webpay');
  const [redirecting, setRedirecting] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    setRedirecting(true);
    try {
      if (paymentMethod === 'stripe') {
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, email: data.email }),
        });
        const json = await res.json() as { url?: string; error?: string };
        if (!res.ok || !json.url) throw new Error(json.error ?? 'Error con Stripe');
        clearCart();
        window.location.href = json.url;
        return;
      }

      if (paymentMethod === 'webpay') {
        const res = await fetch('/api/checkout/webpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, sessionId: `session-${Date.now()}` }),
        });
        const json = await res.json() as { token?: string; url?: string; error?: string };
        if (!res.ok || !json.token || !json.url) throw new Error(json.error ?? 'Error con WebPay');
        // WebPay requiere POST form con el token
        clearCart();
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = json.url;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = json.token;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        return;
      }

      if (paymentMethod === 'mercadopago') {
        const res = await fetch('/api/checkout/mercadopago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, email: data.email }),
        });
        const json = await res.json() as { url?: string; error?: string };
        if (!res.ok || !json.url) throw new Error(json.error ?? 'Error con MercadoPago');
        clearCart();
        window.location.href = json.url;
        return;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al procesar el pago');
      setRedirecting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
        <Link href="/products"><Button>Ir a la tienda</Button></Link>
      </div>
    );
  }

  const loading = isSubmitting || redirecting;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Lock className="h-3 w-3" /> Pago seguro con encriptación SSL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">

          {/* Contacto */}
          <section>
            <h2 className="font-semibold mb-4">1. Información de contacto</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" placeholder="tu@email.com" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Nombre completo</Label>
                <Input placeholder="Nombre y apellido" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
            </div>
          </section>

          <Separator />

          {/* Envío */}
          <section>
            <h2 className="font-semibold mb-4">2. Dirección de envío</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <Label>Dirección</Label>
                <Input placeholder="Av. Providencia 1234, Dpto. 56" {...register('address')} className={errors.address ? 'border-destructive' : ''} />
                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Ciudad</Label>
                <Input placeholder="Santiago" {...register('city')} className={errors.city ? 'border-destructive' : ''} />
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>
            </div>
          </section>

          <Separator />

          {/* Método de pago */}
          <section>
            <h2 className="font-semibold mb-4">3. Método de pago</h2>
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
          </section>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Redirigiendo al pago...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Continuar al pago · {formatPrice(total)}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Serás redirigido al sitio de pago para completar tu compra de forma segura.
          </p>
        </form>

        {/* Resumen */}
        <aside className="lg:col-span-2">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">Resumen del pedido</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 items-center">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${productGradients[product.category] ?? 'from-gray-500 to-gray-700'} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-sm">{product.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">x{quantity}</p>
                  </div>
                  <span className="text-sm font-bold">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} ítems)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span className="text-emerald-500 font-medium">Gratis</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total a pagar</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">🔒 Pago encriptado SSL</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
