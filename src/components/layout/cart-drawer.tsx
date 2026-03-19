'use client';

import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/store/cart';
import { formatPrice, productGradients } from '@/lib/products';

// Drawer lateral del carrito — usa Zustand para el estado compartido
export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito ({items.length} {items.length === 1 ? 'ítem' : 'ítems'})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Estado vacío */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
            <Link href="/products" onClick={closeCart} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Ver productos
            </Link>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3">
                  {/* Imagen placeholder */}
                  <div className={`h-16 w-16 rounded-lg bg-gradient-to-br ${productGradients[product.category] ?? 'from-gray-500 to-gray-700'} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold text-lg">{product.name[0]}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(product.price)} c/u</p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(product.id, quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(product.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <p className="text-sm font-bold">{formatPrice(product.price * quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen y checkout */}
            <div className="px-6 py-4 border-t border-border space-y-4">
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span className="text-emerald-500">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center w-full h-11 px-8 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Proceder al pago
              </Link>
              <Link href="/products" onClick={closeCart} className="flex items-center justify-center w-full h-10 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                Seguir comprando
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
