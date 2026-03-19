import Link from 'next/link';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/shop/product-card';
import { getFeaturedProducts, categories, productGradients } from '@/lib/products';

const benefits = [
  { icon: <Truck className="h-5 w-5" />, title: 'Envío Gratis', desc: 'En compras sobre $30.000' },
  { icon: <Shield className="h-5 w-5" />, title: 'Pago Seguro', desc: 'Encriptado con SSL' },
  { icon: <RotateCcw className="h-5 w-5" />, title: 'Devoluciones', desc: '30 días sin preguntas' },
  { icon: <Headphones className="h-5 w-5" />, title: 'Soporte 24/7', desc: 'Siempre disponibles' },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
              🔥 Ofertas de temporada — Hasta 40% descuento
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Tecnología y Lifestyle{' '}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                al mejor precio
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Electrónicos, ropa, hogar y deportes. Envíos a todo Chile. Garantía en todos los productos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="px-8">
                  Ver todos los productos <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/products?badge=Oferta">
                <Button size="lg" variant="outline" className="px-8">
                  Ver ofertas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits bar */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="opacity-80">{b.icon}</div>
                <div>
                  <p className="text-sm font-semibold">{b.title}</p>
                  <p className="text-xs opacity-70">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Categorías</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl h-36 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${productGradients[cat.slug] ?? 'from-gray-500 to-gray-700'} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 text-center text-white">
                <p className="font-bold text-lg">{cat.name}</p>
                <p className="text-xs opacity-80">{cat.count} productos</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Productos Destacados</h2>
          <Link href="/products" className="text-sm text-primary hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-10 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">¿Primera compra?</h2>
          <p className="mb-6 opacity-90">Usa el código BIENVENIDO para obtener 10% de descuento en tu primer pedido.</p>
          <Link href="/products">
            <Button variant="secondary" size="lg" className="px-8">
              Comprar ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
