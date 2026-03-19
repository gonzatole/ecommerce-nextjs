// ─── Tipos del E-Commerce ────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  badge?: 'Nuevo' | 'Oferta' | 'Popular' | 'Agotado';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Para el checkout — aquí se conectaría con la API de Stripe
export interface CheckoutData {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  cardNumber: string; // En producción usaría Stripe Elements
}
