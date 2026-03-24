/**
 * MercadoPago — ampliamente usado en Chile y LATAM.
 * Acepta: tarjetas de crédito/débito, transferencia, efectivo (Klap/Multicaja).
 *
 * Producción: requiere `MERCADOPAGO_ACCESS_TOKEN` en .env
 * Test: usa token de sandbox que empieza con TEST-
 *
 * Docs: https://www.mercadopago.cl/developers/es/docs
 */

import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { CartItem } from '@/types';

function getMpClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? 'TEST-placeholder';
  return new MercadoPagoConfig({ accessToken });
}

export interface CreateMpPreferenceParams {
  items: CartItem[];
  payerEmail?: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
  externalReference?: string;
}

export async function createMercadoPagoPreference({
  items,
  payerEmail,
  successUrl,
  failureUrl,
  pendingUrl,
  externalReference,
}: CreateMpPreferenceParams) {
  const client = getMpClient();
  const preference = new Preference(client);

  const mpItems = items.map(({ product, quantity }) => ({
    id: product.id,
    title: product.name,
    description: product.description.slice(0, 256),
    quantity,
    currency_id: 'CLP',
    unit_price: product.price,
  }));

  const result = await preference.create({
    body: {
      items: mpItems,
      payer: payerEmail ? { email: payerEmail } : undefined,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      auto_return: 'approved',
      external_reference: externalReference,
      statement_descriptor: 'TechMarket',
      // payment_methods sirve para controlar cuotas etc.
      payment_methods: {
        installments: 1, // sin cuotas por defecto
        excluded_payment_types: [],
      },
    },
  });

  return result;
}
