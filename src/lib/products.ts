import type { Product, Category } from '@/types';

// ─── Datos mock — migrar a PostgreSQL + Prisma en producción ─────────────────
// SQL equivalente: SELECT * FROM products WHERE ...

export const categories: Category[] = [
  { id: 'cat1', name: 'Electrónicos', slug: 'electronicos', count: 6 },
  { id: 'cat2', name: 'Ropa', slug: 'ropa', count: 4 },
  { id: 'cat3', name: 'Hogar', slug: 'hogar', count: 4 },
  { id: 'cat4', name: 'Deportes', slug: 'deportes', count: 4 },
];

export const products: Product[] = [
  {
    id: 'p1', slug: 'auriculares-pro', name: 'Auriculares Pro X500',
    description: 'Auriculares inalámbricos con cancelación activa de ruido y 30 horas de batería. Audio de alta fidelidad y diseño ergonómico premium.',
    price: 79900, originalPrice: 99900, category: 'electronicos',
    imageUrl: '', rating: 4.8, reviewCount: 234, stock: 15, featured: true, badge: 'Oferta',
  },
  {
    id: 'p2', slug: 'smartwatch-fit', name: 'SmartWatch FitPro',
    description: 'Reloj inteligente con monitor cardíaco, GPS integrado y resistencia al agua IP68. Compatible con iOS y Android.',
    price: 129900, category: 'electronicos',
    imageUrl: '', rating: 4.6, reviewCount: 187, stock: 8, featured: true, badge: 'Popular',
  },
  {
    id: 'p3', slug: 'parlante-bluetooth', name: 'Parlante Bluetooth 360°',
    description: 'Sonido envolvente 360° con batería de 24 horas. Resistente al agua y polvo. Perfecto para exteriores.',
    price: 49900, originalPrice: 65900, category: 'electronicos',
    imageUrl: '', rating: 4.5, reviewCount: 312, stock: 22, featured: false, badge: 'Oferta',
  },
  {
    id: 'p4', slug: 'tablet-pro', name: 'Tablet UltraSlim 11"',
    description: 'Pantalla AMOLED 11 pulgadas, 8GB RAM, 256GB almacenamiento. Ideal para trabajo y entretenimiento.',
    price: 349900, category: 'electronicos',
    imageUrl: '', rating: 4.7, reviewCount: 98, stock: 5, featured: true, badge: 'Nuevo',
  },
  {
    id: 'p5', slug: 'teclado-mecanico', name: 'Teclado Mecánico RGB',
    description: 'Switches mecánicos azules, retroiluminación RGB personalizable y diseño compacto TKL.',
    price: 59900, category: 'electronicos',
    imageUrl: '', rating: 4.4, reviewCount: 156, stock: 18, featured: false,
  },
  {
    id: 'p6', slug: 'mouse-gaming', name: 'Mouse Gaming 12000 DPI',
    description: 'Sensor óptico de alta precisión, 6 botones programables y diseño ergonómico para gaming profesional.',
    price: 34900, category: 'electronicos',
    imageUrl: '', rating: 4.3, reviewCount: 203, stock: 30, featured: false,
  },
  {
    id: 'p7', slug: 'poleron-tech', name: 'Polerón Tech Hoodie',
    description: 'Algodón orgánico 400g/m², diseño moderno con capucha ajustable. Colores: Negro, Gris, Azul.',
    price: 29900, category: 'ropa',
    imageUrl: '', rating: 4.6, reviewCount: 89, stock: 25, featured: false, badge: 'Nuevo',
  },
  {
    id: 'p8', slug: 'camiseta-minimalista', name: 'Camiseta Minimalista',
    description: 'Camiseta unisex de algodón pima. Corte relaxed y acabado suave. 12 colores disponibles.',
    price: 14900, originalPrice: 19900, category: 'ropa',
    imageUrl: '', rating: 4.4, reviewCount: 145, stock: 50, featured: false, badge: 'Oferta',
  },
  {
    id: 'p9', slug: 'jeans-slim', name: 'Jeans Slim Premium',
    description: 'Denim de alta calidad con elastán. Corte slim moderno y costuras reforzadas. Negro y azul índigo.',
    price: 39900, category: 'ropa',
    imageUrl: '', rating: 4.2, reviewCount: 67, stock: 15, featured: false,
  },
  {
    id: 'p10', slug: 'chaqueta-cortaviento', name: 'Chaqueta Cortavientos',
    description: 'Material impermeable ligero, capucha plegable y bolsillos laterales con cierre. Ideal para senderismo.',
    price: 54900, originalPrice: 74900, category: 'ropa',
    imageUrl: '', rating: 4.7, reviewCount: 112, stock: 10, featured: true, badge: 'Oferta',
  },
  {
    id: 'p11', slug: 'lampara-escritorio', name: 'Lámpara LED Escritorio',
    description: 'Luz LED ajustable en temperatura y brillo, base antideslizante y puerto USB de carga integrado.',
    price: 24900, category: 'hogar',
    imageUrl: '', rating: 4.5, reviewCount: 78, stock: 20, featured: false,
  },
  {
    id: 'p12', slug: 'organizador-cables', name: 'Organizador de Cables Premium',
    description: 'Kit de 50 piezas para organizar cables. Clips, velcro y fundas. Compatible con todos los tamaños.',
    price: 9900, category: 'hogar',
    imageUrl: '', rating: 4.3, reviewCount: 234, stock: 100, featured: false,
  },
  {
    id: 'p13', slug: 'soporte-monitor', name: 'Soporte Monitor Doble',
    description: 'Brazo articulado para 2 monitores. Carga máx. 9kg por brazo. Ajuste de altura, ángulo y rotación.',
    price: 69900, category: 'hogar',
    imageUrl: '', rating: 4.8, reviewCount: 145, stock: 7, featured: true, badge: 'Popular',
  },
  {
    id: 'p14', slug: 'planta-suculenta', name: 'Kit Plantas Suculentas x5',
    description: 'Set de 5 suculentas en macetas de cerámica. Ideales para escritorio y bajo mantenimiento.',
    price: 19900, category: 'hogar',
    imageUrl: '', rating: 4.6, reviewCount: 89, stock: 30, featured: false, badge: 'Nuevo',
  },
  {
    id: 'p15', slug: 'botella-deportiva', name: 'Botella Térmica 1L',
    description: 'Acero inoxidable, mantiene frío/calor 24h. Libre de BPA, tapa de seguridad y asa ergonómica.',
    price: 22900, originalPrice: 29900, category: 'deportes',
    imageUrl: '', rating: 4.7, reviewCount: 312, stock: 40, featured: false, badge: 'Oferta',
  },
  {
    id: 'p16', slug: 'mochila-urbana', name: 'Mochila Urbana 30L',
    description: 'Compartimento laptop 15", puerto USB de carga externo, material resistente al agua. Perfecta para trabajo.',
    price: 44900, category: 'deportes',
    imageUrl: '', rating: 4.5, reviewCount: 198, stock: 12, featured: true, badge: 'Popular',
  },
  {
    id: 'p17', slug: 'mancuernas-ajustables', name: 'Mancuernas Ajustables 20kg',
    description: 'Sistema dial de ajuste rápido de 2 a 20kg. Reemplaza 15 pares de mancuernas tradicionales.',
    price: 89900, category: 'deportes',
    imageUrl: '', rating: 4.9, reviewCount: 67, stock: 3, featured: true, badge: 'Popular',
  },
  {
    id: 'p18', slug: 'mat-yoga', name: 'Mat Yoga Antideslizante 6mm',
    description: 'Material ECO TPE, 183cm x 61cm. Marcadores de alineación y bolsa de transporte incluida.',
    price: 29900, category: 'deportes',
    imageUrl: '', rating: 4.4, reviewCount: 145, stock: 25, featured: false,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
  );
}

// Gradientes para las imágenes placeholder de productos
export const productGradients: Record<string, string> = {
  electronicos: 'from-blue-600 to-indigo-700',
  ropa: 'from-violet-600 to-purple-700',
  hogar: 'from-emerald-600 to-teal-700',
  deportes: 'from-amber-600 to-orange-700',
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
}
