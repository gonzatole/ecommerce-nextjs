import { db } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteProductAction, toggleFeaturedAction, toggleActiveAction } from '@/actions/productos';

const categoryLabels: Record<string, string> = {
  electronicos: 'Electrónicos',
  ropa: 'Ropa',
  hogar: 'Hogar',
  deportes: 'Deportes',
};

const badgeColors: Record<string, string> = {
  Nuevo: 'bg-blue-100 text-blue-800',
  Oferta: 'bg-red-100 text-red-800',
  Popular: 'bg-yellow-100 text-yellow-800',
  Agotado: 'bg-gray-100 text-gray-600',
};

export default async function AdminProductosPage() {
  const products = await db.product.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} productos en total</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-muted-foreground">Producto</th>
                <th className="text-left px-4 py-4 font-medium text-muted-foreground">Categoría</th>
                <th className="text-right px-4 py-4 font-medium text-muted-foreground">Precio</th>
                <th className="text-center px-4 py-4 font-medium text-muted-foreground">Stock</th>
                <th className="text-center px-4 py-4 font-medium text-muted-foreground">Estado</th>
                <th className="text-right px-6 py-4 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  {/* Producto */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{product.name}</p>
                          {product.featured && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                          {product.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${badgeColors[product.badge] ?? ''}`}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">
                      {categoryLabels[product.category] ?? product.category}
                    </span>
                  </td>

                  {/* Precio */}
                  <td className="px-4 py-4 text-right">
                    <p className="font-medium">${product.price.toLocaleString('es-CL')}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString('es-CL')}
                      </p>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-4 py-4 text-center">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <form action={toggleActiveAction.bind(null, product.id, !product.active)}>
                        <button
                          type="submit"
                          title={product.active ? 'Desactivar' : 'Activar'}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors ${product.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {product.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          {product.active ? 'Activo' : 'Inactivo'}
                        </button>
                      </form>
                      <form action={toggleFeaturedAction.bind(null, product.id, !product.featured)}>
                        <button
                          type="submit"
                          title={product.featured ? 'Quitar destacado' : 'Destacar'}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${product.featured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {product.featured ? '★ Dest.' : '☆ Dest.'}
                        </button>
                      </form>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/productos/${product.id}/editar`}>
                        <Button size="sm" variant="outline" className="h-8 gap-1.5">
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                      </Link>
                      <form action={deleteProductAction.bind(null, product.id)}>
                        <button
                          type="submit"
                          onClick={(e) => { if (!confirm(`¿Eliminar "${product.name}"?`)) e.preventDefault(); }}
                          className="h-8 px-3 rounded-md text-sm border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="mb-4">No hay productos aún.</p>
            <Link href="/admin/productos/nuevo">
              <Button>Crear primer producto</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
