/**
 * WebPay Plus (Transbank) — el método de pago más usado en Chile.
 *
 * Modo integración (test): usa credenciales públicas de Transbank.
 * Modo producción: requiere `WEBPAY_COMMERCE_CODE` y `WEBPAY_API_KEY` en .env
 *
 * Docs: https://www.transbankdevelopers.cl/documentacion/webpay-plus
 */

import {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Environment,
} from 'transbank-sdk';

function getTransaction() {
  const isProduction = process.env.NODE_ENV === 'production' && !!process.env.WEBPAY_COMMERCE_CODE;

  if (isProduction) {
    return new WebpayPlus.Transaction(
      new Options(
        process.env.WEBPAY_COMMERCE_CODE!,
        process.env.WEBPAY_API_KEY!,
        Environment.Production,
      ),
    );
  }

  // Credenciales de integración (test) — públicas por Transbank
  return new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration,
    ),
  );
}

export interface CreateWebpayTransactionParams {
  buyOrder: string;       // ID único del pedido (max 26 chars)
  sessionId: string;      // ID de sesión del usuario (max 61 chars)
  amount: number;         // Monto en CLP (entero)
  returnUrl: string;      // URL donde Transbank redirige tras pago
}

export async function createWebpayTransaction({
  buyOrder,
  sessionId,
  amount,
  returnUrl,
}: CreateWebpayTransactionParams) {
  const tx = getTransaction();
  // response: { token, url } — redirigir a url con token como param POST
  const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
  return response as { token: string; url: string };
}

export async function commitWebpayTransaction(token: string) {
  const tx = getTransaction();
  const response = await tx.commit(token);
  return response;
}

/**
 * WebPay devuelve el token vía POST. La página de retorno debe leer
 * `req.formData()` y llamar a `commitWebpayTransaction(token)`.
 *
 * Status codes de response:
 * - responseCode === 0: APROBADO
 * - responseCode !== 0: RECHAZADO / ERROR
 */
