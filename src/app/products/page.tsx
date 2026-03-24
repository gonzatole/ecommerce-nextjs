import { db } from '@/lib/prisma';
import { products as staticProducts, categories as staticCategories, dbToShopProduct } from '@/lib/products';
import { ProductsClient } from '@/components/shop/products-client';
import type { Category } from '@/types';

export default async function ProductsPage() {
  let allProducts;
  let categories;

  try {
    const dbProducts = await db.product.findMany({
      where: { active: true },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });
    allProducts = dbProducts.map(dbToShopProduct);

    // Calcular categorías desde la DB
    const grouped = dbProducts.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    const categoryNames: Record<string, string> = {
      electronicos: 'Electrónicos',
      ropa: 'Ropa',
      hogar: 'Hogar',
      deportes: 'Deportes',
    };
    categories = Object.entries(grouped).map<Category>(([slug, count]) => ({
      id: slug,
      name: categoryNames[slug] ?? slug,
      slug,
      count,
    }));
  } catch {
    allProducts = staticProducts;
    categories = staticCategories;
  }

  return <ProductsClient products={allProducts} categories={categories} />;
}
