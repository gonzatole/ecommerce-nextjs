import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, RotateCcw, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getProductBySlug, getProductsByCategory, formatPrice, productGradients, dbToShopProduct } from '@/lib/products';
import { AddToCartButton } from '@/components/shop/add-to-cart-button';
import { ProductCard } from '@/components/shop/product-card';
import { db } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const p = await db.product.findUnique({ where: { slug, active: true } });
    if (p) return { title: `${p.name} | TechMarket`, description: p.description };
  } catch { /* fallback */ }
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado' };
  return { title: `${product.name} | TechMarket`, description: product.description };
}

const badgeColors: Record<string, string> = {
  Nuevo: 'bg-blue-500 text-white border-0',
  Oferta: 'bg-red-500 text-white border-0',
  Popular: 'bg-amber-500 text-white border-0',
  Agotado: 'bg-muted text-muted-foreground',
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  let product;
  let related: import('@/types').Product[] = [];

  try {
    const dbProduct = await db.product.findUnique({ where: { slug, active: true } });
    if (dbProduct) {
      product = dbToShopProduct(dbProduct);
      const dbRelated = await db.product.findMany({
        where: { category: dbProduct.category, active: true, id: { not: dbProduct.id } },
        take: 4,
      });
      related = dbRelated.map(dbToShopProduct);
    }
  } catch { /* fallback to static */ }

  if (!product) {
    product = getProductBySlug(slug);
    if (!product) notFound();
    related = getProductsByCategory(product.category).filter((p) => p.id !== product!.id).slice(0, 4);
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const gradient = productGradients[product.category] ?? 'from-gray-500 to-gray-700';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">Productos</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-48">{product.name}</span>
      </nav>

      {/* Back button (mobile) */}
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 lg:hidden transition-colors">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* Image */}
        <div className="space-y-4">
          <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} h-80 sm:h-96 lg:h-[480px] flex items-center justify-center`}>
            {/* Decorative orbs */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 w-32 h-32 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-full blur-xl" />
            </div>
            <span className="text-white/10 text-[10rem] font-black select-none leading-none">
              {product.name[0]}
            </span>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <Badge className={`text-xs ${badgeColors[product.badge] ?? ''}`}>
                  {product.badge}
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-red-500 text-white border-0 text-xs">
                  -{discount}% OFF
                </Badge>
              )}
            </div>

            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="outline" className="bg-black/50 text-white border-0 text-xs backdrop-blur-sm">
                  ¡Solo {product.stock} disponibles!
                </Badge>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Truck className="h-4 w-4" />, text: 'Envío gratis' },
              { icon: <Shield className="h-4 w-4" />, text: 'Pago seguro' },
              { icon: <RotateCcw className="h-4 w-4" />, text: '30 días de garantía' },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 text-center">
                <div className="text-primary">{item.icon}</div>
                <span className="text-xs text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm text-muted-foreground capitalize mb-1">{product.category}</p>
            <h1 className="text-3xl font-black tracking-tight mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} reseñas)</span>
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through mb-1">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-sm text-emerald-600 font-medium mt-1">
                Ahorras {formatPrice(product.originalPrice! - product.price)} ({discount}%)
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            {product.stock === 0 ? (
              <span className="text-sm font-medium text-destructive">Sin stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-sm font-medium text-amber-600">Solo quedan {product.stock} unidades</span>
            ) : (
              <span className="text-sm text-emerald-600 font-medium">En stock ({product.stock} unidades)</span>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Descripción</h2>
            <p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>
          </div>

          <Separator />

          {/* Add to cart */}
          <AddToCartButton product={product} />

          {/* Checkout link */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Ir al carrito
          </Link>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
