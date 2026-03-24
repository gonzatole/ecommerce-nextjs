'use client';

import { useTransition, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import type { Product } from '@/generated/prisma/client';

const CATEGORIES = [
  { value: 'electronicos', label: '💻 Electrónicos' },
  { value: 'ropa', label: '👕 Ropa' },
  { value: 'hogar', label: '🏠 Hogar' },
  { value: 'deportes', label: '⚽ Deportes' },
];

const BADGES = [
  { value: 'none', label: 'Sin badge' },
  { value: 'Nuevo', label: '🆕 Nuevo' },
  { value: 'Oferta', label: '🔥 Oferta' },
  { value: 'Popular', label: '⭐ Popular' },
  { value: 'Agotado', label: '❌ Agotado' },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

interface Props {
  product?: Product;
  action: (formData: FormData) => Promise<void>;
}

export function ProductForm({ product, action }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(!!product);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugEdited && name) {
      setSlug(slugify(name));
    }
  }, [name, slugEdited]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-border shadow-sm space-y-5">
            <h2 className="font-semibold text-base">Información principal</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre del producto *</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Auriculares Sony WH-1000XM5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                placeholder="auriculares-sony-wh-1000xm5"
                required
              />
              <p className="text-xs text-muted-foreground">URL: /products/{slug || '...'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description}
                placeholder="Describe el producto detalladamente..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de imagen</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={product?.imageUrl ?? ''}
                placeholder="https://ejemplo.com/imagen.jpg"
                type="url"
              />
              <p className="text-xs text-muted-foreground">Pega una URL de imagen. Puedes usar Unsplash, Cloudinary, etc.</p>
            </div>
          </div>

          {/* Precios */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-border shadow-sm space-y-5">
            <h2 className="font-semibold text-base">Precios (CLP)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio de venta *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={product?.price}
                  placeholder="49900"
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Precio original <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  defaultValue={product?.originalPrice ?? ''}
                  placeholder="69900"
                  min={0}
                />
                <p className="text-xs text-muted-foreground">Dejar vacío si no hay descuento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          {/* Organización */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-border shadow-sm space-y-5">
            <h2 className="font-semibold text-base">Organización</h2>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <select
                id="category"
                name="category"
                defaultValue={product?.category ?? 'electronicos'}
                className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground h-9"
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Badge</Label>
              <select
                id="badge"
                name="badge"
                defaultValue={product?.badge ?? 'none'}
                className="w-full text-sm border border-input rounded-md px-3 py-2 bg-background text-foreground h-9"
              >
                {BADGES.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={product?.stock ?? 0}
                min={0}
              />
            </div>
          </div>

          {/* Métricas */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-border shadow-sm space-y-5">
            <h2 className="font-semibold text-base">Métricas</h2>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0–5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                defaultValue={product?.rating ?? 0}
                min={0}
                max={5}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewCount">Número de reseñas</Label>
              <Input
                id="reviewCount"
                name="reviewCount"
                type="number"
                defaultValue={product?.reviewCount ?? 0}
                min={0}
              />
            </div>
          </div>

          {/* Visibilidad */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-border shadow-sm space-y-4">
            <h2 className="font-semibold text-base">Visibilidad</h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                defaultChecked={product?.active ?? true}
                className="h-4 w-4 rounded accent-primary"
              />
              <div>
                <p className="text-sm font-medium">Producto activo</p>
                <p className="text-xs text-muted-foreground">Visible en la tienda</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured ?? false}
                className="h-4 w-4 rounded accent-primary"
              />
              <div>
                <p className="text-sm font-medium">Producto destacado</p>
                <p className="text-xs text-muted-foreground">Aparece en la página de inicio</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="gap-2 min-w-[140px]">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isPending ? 'Guardando...' : 'Guardar producto'}
        </Button>
      </div>
    </form>
  );
}
