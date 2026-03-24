'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleAdd = () => {
    if (product.stock === 0) return;
    addItem(product);
    setAdded(true);
    toast.success(`${product.name} agregado al carrito`, {
      action: { label: 'Ver carrito', onClick: openCart },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      size="lg"
      className="w-full h-12 text-base font-semibold rounded-xl"
      onClick={handleAdd}
      disabled={product.stock === 0 || added}
    >
      {added ? (
        <><Check className="h-5 w-5 mr-2" /> Agregado al carrito</>
      ) : (
        <><ShoppingCart className="h-5 w-5 mr-2" /> {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}</>
      )}
    </Button>
  );
}
