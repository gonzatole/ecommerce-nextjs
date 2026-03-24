import { db } from '@/lib/prisma';
import { Package, TrendingUp, AlertTriangle, Star, Plus, Database } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Stats = { total: number; featured: number; outOfStock: number; byCategory: { category: string; _count: number }[] };

async function getStats(): Promise<{ stats: Stats; dbConnected: boolean }> {
  try {
    const [total, featured, outOfStock, byCategory] = await Promise.all([
      db.product.count({ where: { active: true } }),
      db.product.count({ where: { active: true, featured: true } }),
      db.product.count({ where: { active: true, stock: 0 } }),
      db.product.groupBy({ by: ['category'], where: { active: true }, _count: true }),
    ]);
    return { stats: { total, featured, outOfStock, byCategory }, dbConnected: true };
  } catch {
    return { stats: { total: 0, featured: 0, outOfStock: 0, byCategory: [] }, dbConnected: false };
  }
}

const categoryLabels: Record<string, string> = {
  electronicos: '💻 Electrónicos',
  ropa: '👕 Ropa',
  hogar: '🏠 Hogar',
  deportes: '⚽ Deportes',
};

export default async function AdminDashboardPage() {
  const { stats, dbConnected } = await getStats();

  const statCards = [
    { label: 'Productos activos', value: stats.total, icon: Package, color: 'bg-blue-500' },
    { label: 'Destacados', value: stats.featured, icon: Star, color: 'bg-yellow-500' },
    { label: 'Sin stock', value: stats.outOfStock, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Categorías', value: stats.byCategory.length, icon: TrendingUp, color: 'bg-green-500' },
  ];

  return (
    <div className="p-8">
      {/* DB warning banner */}
      {!dbConnected && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-yellow-600 dark:text-yellow-400">
          <Database className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            <strong>Base de datos no conectada.</strong> Configura <code className="mx-1 rounded bg-yellow-500/20 px-1">DATABASE_URL</code> en <code className="rounded bg-yellow-500/20 px-1">.env.local</code> y ejecuta <code className="mx-1 rounded bg-yellow-500/20 px-1">npm run db:push</code>.
          </p>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Resumen general de la tienda</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Por categoría */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-border">
        <h2 className="font-semibold mb-4">Productos por categoría</h2>
        <div className="space-y-3">
          {stats.byCategory.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between">
              <span className="text-sm">{categoryLabels[cat.category] ?? cat.category}</span>
              <div className="flex items-center gap-3">
                <div className="w-40 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(cat._count / stats.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-6 text-right">{cat._count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/productos" className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">Gestionar productos</p>
              <p className="text-xs text-muted-foreground">Ver, editar y eliminar productos</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/productos/nuevo" className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-border hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">Agregar producto</p>
              <p className="text-xs text-muted-foreground">Crear un nuevo producto en la tienda</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
