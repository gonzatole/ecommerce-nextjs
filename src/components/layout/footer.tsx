import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">TechMarket</span>
            </div>
            <p className="text-xs text-muted-foreground">Tu tienda de tecnología y lifestyle. Envíos a todo Chile.</p>
          </div>
          {[
            { title: 'Tienda', links: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Ofertas'] },
            { title: 'Cuenta', links: ['Mi cuenta', 'Mis pedidos', 'Lista de deseos', 'Reseñas'] },
            { title: 'Ayuda', links: ['Envíos', 'Devoluciones', 'Garantía', 'Contacto'] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TechMarket. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
