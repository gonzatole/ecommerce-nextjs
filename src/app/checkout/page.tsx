'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { formatPrice, productGradients } from '@/lib/products';

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  address: z.string().min(5, 'Dirección muy corta'),
  city: z.string().min(2, 'Ciudad requerida'),
  // Card mock — en producción se usaría Stripe Elements (no se envía el número real)
  cardNumber: z.string().length(16, 'Debe tener 16 dígitos').regex(/^\d+$/, 'Solo números'),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Formato MM/AA'),
  cardCvc: z.string().length(3, 'CVC de 3 dígitos').regex(/^\d+$/, 'Solo números'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, closeCart } = useCartStore();
  const total = getTotalPrice();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    // PRODUCCIÓN: aquí iría:
    // 1. Crear PaymentIntent en Stripe → POST /api/create-payment-intent
    // 2. Confirmar con stripe.confirmCardPayment(clientSecret)
    // 3. Guardar orden en PostgreSQL
    console.log('Checkout data:', data);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('¡Pago procesado exitosamente! 🎉', { description: 'Recibirás un email de confirmación.' });
    clearCart();
    closeCart();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
        <Link href="/products">
          <Button>Ir a la tienda</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Lock className="h-3 w-3" />
            Pago seguro con encriptación SSL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">

          {/* Información de contacto */}
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

          {/* Dirección de envío */}
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

          {/* Pago */}
          <section>
            <h2 className="font-semibold mb-1">3. Método de pago</h2>
            <p className="text-xs text-muted-foreground mb-4">
              ⚠️ Demo: usa el número de tarjeta 4242424242424242 (Stripe test)
            </p>
            <div className="p-4 border border-border rounded-xl space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tarjeta de crédito/débito</span>
                <Badge variant="outline" className="text-xs ml-auto">Seguro</Badge>
              </div>

              <div className="space-y-1.5">
                <Label>Número de tarjeta</Label>
                <Input placeholder="4242 4242 4242 4242" maxLength={16} {...register('cardNumber')} className={errors.cardNumber ? 'border-destructive' : ''} />
                {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Vencimiento</Label>
                  <Input placeholder="12/28" maxLength={5} {...register('cardExpiry')} className={errors.cardExpiry ? 'border-destructive' : ''} />
                  {errors.cardExpiry && <p className="text-xs text-destructive">{errors.cardExpiry.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>CVC</Label>
                  <Input placeholder="123" maxLength={3} type="password" {...register('cardCvc')} className={errors.cardCvc ? 'border-destructive' : ''} />
                  {errors.cardCvc && <p className="text-xs text-destructive">{errors.cardCvc.message}</p>}
                </div>
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            <Lock className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Procesando pago...' : `Pagar ${formatPrice(total)}`}
          </Button>
        </form>

        {/* Resumen del pedido */}
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
              <div className="flex justify-between text-muted-foreground">
                <span>Descuento</span>
                <span>-{formatPrice(0)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-base">
              <span>Total a pagar</span>
              <span>{formatPrice(total)}</span>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              🔒 Pago encriptado con SSL · Stripe
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
