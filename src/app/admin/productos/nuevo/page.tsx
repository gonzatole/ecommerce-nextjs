import { ProductForm } from '@/components/admin/product-form';
import { createProductAction } from '@/actions/productos';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NuevoProductoPage() {
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
        <h1 className="text-2xl font-bold">Nuevo producto</h1>
        <p className="text-muted-foreground text-sm mt-1">Completa los datos para agregar un producto a la tienda</p>
      </div>
      <ProductForm action={createProductAction} />
    </div>
  );
}
