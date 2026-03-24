'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prisma';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseProductForm(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string) || slugify(name);
  const description = formData.get('description') as string;
  const price = Math.round(Number(formData.get('price')));
  const originalPriceRaw = formData.get('originalPrice') as string;
  const originalPrice = originalPriceRaw ? Math.round(Number(originalPriceRaw)) : null;
  const category = formData.get('category') as string;
  const imageUrl = (formData.get('imageUrl') as string) || '';
  const stock = Number(formData.get('stock') ?? 0);
  const rating = Number(formData.get('rating') ?? 0);
  const reviewCount = Number(formData.get('reviewCount') ?? 0);
  const featured = formData.get('featured') === 'on';
  const active = formData.get('active') === 'on';
  const badgeRaw = formData.get('badge') as string;
  const badge = badgeRaw && badgeRaw !== 'none' ? badgeRaw : null;

  return { name, slug, description, price, originalPrice, category, imageUrl, stock, rating, reviewCount, featured, active, badge };
}

export async function createProductAction(formData: FormData) {
  const data = parseProductForm(formData);

  // Si el slug ya existe, agregar sufijo numérico
  const existing = await db.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    data.slug = `${data.slug}-${Date.now()}`;
  }

  await db.product.create({ data });
  revalidatePath('/admin/productos');
  revalidatePath('/products');
  revalidatePath('/');
  redirect('/admin/productos');
}

export async function updateProductAction(id: string, formData: FormData) {
  const data = parseProductForm(formData);

  // Verificar que el slug no sea de otro producto
  const existing = await db.product.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    data.slug = `${data.slug}-${Date.now()}`;
  }

  await db.product.update({ where: { id }, data });
  revalidatePath('/admin/productos');
  revalidatePath(`/products/${data.slug}`);
  revalidatePath('/products');
  revalidatePath('/');
  redirect('/admin/productos');
}

export async function deleteProductAction(id: string) {
  await db.product.delete({ where: { id } });
  revalidatePath('/admin/productos');
  revalidatePath('/products');
  revalidatePath('/');
}

export async function toggleFeaturedAction(id: string, featured: boolean) {
  await db.product.update({ where: { id }, data: { featured } });
  revalidatePath('/admin/productos');
  revalidatePath('/');
}

export async function toggleActiveAction(id: string, active: boolean) {
  await db.product.update({ where: { id }, data: { active } });
  revalidatePath('/admin/productos');
  revalidatePath('/products');
}
