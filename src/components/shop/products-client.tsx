'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/shop/product-card';
import type { Product, Category } from '@/types';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating';

interface Props {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export function ProductsClient({ products, categories, initialCategory = 'all' }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<SortOption>('relevance');

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    switch (sort) {
      case 'price-asc':  return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating':     return result.sort((a, b) => b.rating - a.rating);
      default:           return result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [search, selectedCategory, sort, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos los Productos</h1>
        <p className="text-muted-foreground">{filtered.length} productos encontrados</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar productos..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground h-9"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button variant={selectedCategory === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory('all')}>
          Todo
          <Badge className="ml-1.5 h-5 px-1.5 text-xs bg-white/20 border-0">{products.length}</Badge>
        </Button>
        {categories.map((cat) => (
          <Button key={cat.id} variant={selectedCategory === cat.slug ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(cat.slug)}>
            {cat.name}
            <Badge className={`ml-1.5 h-5 px-1.5 text-xs border-0 ${selectedCategory === cat.slug ? 'bg-white/20' : 'bg-muted text-muted-foreground'}`}>
              {cat.count}
            </Badge>
          </Button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Search className="h-12 w-12 opacity-30" />
          <p className="text-lg">No se encontraron productos</p>
          <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory('all'); }}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
