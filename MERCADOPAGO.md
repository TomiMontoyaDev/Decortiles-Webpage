# Tienda DECORTILES: carrito, checkout, Mercado Pago, facturas y dashboard

## 1. Qué hay y dónde

| Qué | Archivo / ruta |
|---|---|
| Precios, envíos, envío gratis, datos de la factura, PIN | `lib/shop-config.ts` |
| Pedidos, totales, consecutivo de facturas, almacenamiento | `lib/orders.ts` |
| Preferencia de pago de Mercado Pago | `lib/mercadopago.ts` |
| Carrito (estado, drawer, modales, recordatorios) | `components/shop/*` |
| Carrito completo | `/carrito/` |
| Checkout en 3 pasos | `/checkout/` |
| Regreso de Mercado Pago / confirmación | `/checkout/resultado/` |
| Factura imprimible (Imprimir → PDF) | `/factura/?id=DT-…` |
| Dashboard de pedidos y facturación | `/admin/` (PIN por defecto `decortiles2026`) |
| Miniaturas WebP del carrito (`public/images/thumbs/`) | `npm run thumbs` — también corre sola antes de `npm run build` |

## 2. Precios

Todavía no hay precios: el sitio muestra "Precio a confirmar" y cada pedido llega al dashboard como
**Por cotizar**. Desde el dashboard el asesor escribe el precio de cada línea y el costo de envío. Al guardar,
el pedido pasa a **Pendiente de pago**, y con Mercado Pago activo el botón "Link de pago" copia el link
para enviarlo al cliente.

Para publicar precios en la web, se agregan en `PRICES` (`lib/shop-config.ts`), en COP con IVA incluido:

```ts
export const PRICES: Partial<Record<string, number>> = {
  p001: 189000, // por caja
  p078: 690000, // por unidad
};
```

Si **todos** los productos del carrito tienen precio y Mercado Pago está activo, el checkout cobra directamente.

## 3. Envíos

- **Recoger en sede**: siempre gratis.
- **Envío local** (área metropolitana de Medellín y Barranquilla, `LOCAL_CITIES`): tarifa fija + valor por kg.
  Es **gratis** cuando el subtotal llega a `FREE_SHIPPING_FROM` (hoy $2.500.000).
- **Envío nacional**: tarifa fija + valor por kg, siempre se cobra.

El peso sale de los datos de caja de cada producto ("27 kg x caja").

## 4. Activar Mercado Pago (Checkout Pro)

El sitio se exporta como HTML estático (`output: 'export'`), así que **el Access Token nunca va en el sitio**.
Hace falta un endpoint pequeño que cree la preferencia. Puede ser una función serverless (Vercel, Netlify,
Cloudflare) o un archivo PHP en el mismo hosting.

### 4.1 Variables (en `.env.local` o en el hosting, antes de `npm run build`)

```
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxxxxx
NEXT_PUBLIC_MP_PREFERENCE_URL=https://api.decorcolombiatiles.com/mp/preference
NEXT_PUBLIC_ADMIN_PIN=un-pin-largo
# opcional: API para guardar pedidos en servidor (ver punto 5)
NEXT_PUBLIC_ORDERS_API_URL=https://api.decorcolombiatiles.com/orders
```

### 4.2 Endpoint de preferencia (Node, ejemplo para función serverless)

El sitio envía `POST { order, preference }`. `preference` ya viene en el formato de la API
(`items`, `payer`, `back_urls`, `external_reference` = id del pedido). El backend **debe recalcular
los precios** con su propia lista y no confiar en los que manda el navegador.

```js
// npm i mercadopago
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const PRICES = { p001: 189000 /* … misma lista que lib/shop-config.ts … */ };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://decorcolombiatiles.com");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const { preference } = req.body;
  preference.items = preference.items.map((i) => ({ ...i, unit_price: PRICES[i.id] }));
  if (preference.items.some((i) => !i.unit_price)) return res.status(400).json({ error: "Producto sin precio" });

  preference.notification_url = "https://api.decorcolombiatiles.com/mp/webhook";
  const pref = await new Preference(client).create({ body: preference });
  res.json({ id: pref.id, init_point: pref.init_point });
}
```

### 4.3 Webhook (confirmación real del pago)

`/checkout/resultado/` marca el pedido como pagado cuando Mercado Pago regresa con `status=approved`, pero eso
pasa en el navegador y se puede falsificar. La confirmación válida es el webhook: al recibir
`type=payment`, consultar `GET /v1/payments/{id}` con el Access Token y, si `status === "approved"`,
actualizar el pedido `external_reference` a `pagado` en la API de pedidos.

### 4.4 Pruebas

Usa las credenciales y tarjetas de prueba de tu cuenta en https://www.mercadopago.com.co/developers.

## 5. Dónde se guardan los pedidos

- **Sin `NEXT_PUBLIC_ORDERS_API_URL`** (modo actual): los pedidos y facturas se guardan en el `localStorage`
  del navegador donde se hizo el pedido. Sirve para probar todo el flujo (incluido el botón "Cargar pedidos de
  ejemplo" del dashboard), pero **el dashboard no ve los pedidos hechos desde otros equipos**.
- **Con la API**: el sitio llama a `GET /`, `GET /:id`, `POST /`, `PUT /:id` y `DELETE /:id` con el objeto
  `Order` de `lib/orders.ts` en JSON. Cualquier backend sencillo sirve (Supabase, Firebase o una tabla
  MySQL con PHP). El consecutivo de facturas debería asignarlo ese backend para que no se repita.

## 6. Seguridad del dashboard

El PIN de `/admin` se valida en el navegador, así que solo sirve como barrera visual: cualquiera que lea el
JavaScript puede verlo. Antes de manejar pedidos reales, protege `/admin` en el hosting (contraseña
`.htaccess`, Cloudflare Access o Vercel Password) y pide autenticación en la API de pedidos.

## 7. Facturas

Se genera una **proforma** con cada pedido y una **factura de venta** con consecutivo `FV-2026-000001` cuando
el pedido pasa a Pagado (desde Mercado Pago o desde el dashboard). Lleva logo, NIT, fecha, cliente, documento,
id del pedido, líneas, envío, base, IVA 19 % y total. Antes de publicar, reemplaza el NIT en `COMPANY`
(`lib/shop-config.ts`).

En Colombia la factura electrónica válida ante la DIAN la emite un proveedor tecnológico autorizado
(Siigo, Alegra, etc.). Este documento sirve como comprobante para el cliente, y los datos del pedido se pueden
exportar en CSV desde el dashboard para cargarlos en ese sistema.
