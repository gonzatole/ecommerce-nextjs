'use client';

import { Check } from 'lucide-react';

export type PaymentMethod = 'webpay' | 'stripe' | 'mercadopago';

interface Option {
  id: PaymentMethod;
  label: string;
  description: string;
  logo: React.ReactNode;
  badge?: string;
  color: string;
}

const METHODS: Option[] = [
  {
    id: 'webpay',
    label: 'WebPay Plus',
    description: 'Tarjetas chilenas (Visa, Mastercard, Redcompra), débito y crédito',
    badge: 'Recomendado en Chile',
    color: 'border-blue-600 bg-blue-50 dark:bg-blue-950/30',
    logo: (
      <div className="flex items-center gap-1">
        <div className="h-7 w-16 rounded bg-[#003399] flex items-center justify-center px-2">
          <span className="text-white text-[10px] font-black tracking-tight leading-none">WEBPAY<br />plus</span>
        </div>
        <div className="h-5 w-8 rounded bg-[#00A651] flex items-center justify-center">
          <span className="text-white text-[7px] font-bold">Banco<br/>Estado</span>
        </div>
      </div>
    ),
  },
  {
    id: 'mercadopago',
    label: 'MercadoPago',
    description: 'Tarjetas, transferencias, Klap y más métodos de pago',
    color: 'border-sky-400 bg-sky-50 dark:bg-sky-950/30',
    logo: (
      <div className="h-7 w-24 rounded-md bg-[#009EE3] flex items-center justify-center px-3">
        <span className="text-white text-[11px] font-black tracking-tight">mercadopago</span>
      </div>
    ),
  },
  {
    id: 'stripe',
    label: 'Tarjeta internacional',
    description: 'Visa, Mastercard y American Express internacionales',
    color: 'border-violet-500 bg-violet-50 dark:bg-violet-950/30',
    logo: (
      <div className="flex items-center gap-1.5">
        <div className="h-7 w-12 rounded bg-[#635BFF] flex items-center justify-center">
          <span className="text-white text-[11px] font-black italic">stripe</span>
        </div>
        <div className="flex gap-0.5">
          {['VISA', 'MC'].map((b) => (
            <div key={b} className="h-5 w-7 rounded bg-muted flex items-center justify-center">
              <span className="text-[7px] font-bold text-muted-foreground">{b}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

interface Props {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}

export function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      {METHODS.map((method) => {
        const selected = value === method.id;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-150 ${
              selected
                ? `${method.color} border-opacity-100`
                : 'border-border bg-card hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Custom radio */}
              <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                selected ? 'border-primary bg-primary' : 'border-muted-foreground/40 bg-background'
              }`}>
                {selected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-semibold text-sm">{method.label}</span>
                  {method.badge && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                      {method.badge}
                    </span>
                  )}
                </div>
                <div className="mb-2">{method.logo}</div>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
            </div>
          </button>
        );
      })}

      {/* Not yet available notice */}
      <div className="rounded-xl border border-dashed border-border p-4 opacity-60">
        <p className="text-xs text-muted-foreground text-center">
          Próximamente: PayPal, Débito automático, Criptomonedas
        </p>
      </div>
    </div>
  );
}
