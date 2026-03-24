import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { updateProductAction } from '@/actions/productos';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  const action = updateProductAction.bind(null, id);

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/productos"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>
        <h1 className="text-2xl font-bold">Editar producto</h1>
        <p className="text-muted-foreground text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm product={product} action={action} />
    </div>
  );
}
