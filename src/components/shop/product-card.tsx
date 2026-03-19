'use client';

import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { formatPrice, productGradients } from '@/lib/products';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const badgeColors: Record<string, string> = {
  Nuevo: 'bg-blue-500 text-white border-0',
  Oferta: 'bg-red-500 text-white border-0',
  Popular: 'bg-amber-500 text-white border-0',
  Agotado: 'bg-muted text-muted-foreground',
};

// Componente reutilizable de tarjeta de producto
// Dumb component: recibe datos, emite acciones al store de Zustand
export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} agregado al carrito`, {
      action: {
        label: 'Ver carrito',
        onClick: openCart,
      },
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Imagen / Banner */}
      <Link href={`/products/${product.slug}`}>
        <div className={`h-48 bg-gradient-to-br ${productGradients[product.category] ?? 'from-gray-500 to-gray-700'} relative flex items-center justify-center overflow-hidden`}>
          {/* Letra grande como placeholder visual */}
          <span className="text-white/20 text-8xl font-black select-none group-hover:scale-110 transition-transform duration-500">
            {product.name[0]}
          </span>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <Badge className={`text-xs ${badgeColors[product.badge] ?? ''}`}>
                {product.badge}
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-red-500 text-white border-0 text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Stock bajo */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm">
                ¡Solo {product.stock} disponibles!
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        {/* Info */}
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-base">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="h-8 px-3"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            {product.stock === 0 ? 'Agotado' : 'Agregar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
