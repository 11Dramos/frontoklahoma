# Oklahoma Burgers & Ribs — Front de pedidos

Front de la página de pedidos online del local, construido con React + Vite + Tailwind CSS.
Reemplaza la página de menú/pedidos que hoy corre en Fudo.

## Estado actual

- Menú por categorías, buscador, carrito y flujo de checkout (delivery/retiro, horario, datos de contacto).
- Datos de menú reales en [`src/data/menu.js`](src/data/menu.js) (nombres, descripciones y precios).
- **Simulado por ahora**, pendiente de conectar a un backend real:
  - Cotización de delivery (pensado para Uber Direct).
  - Pago online (pensado para Webpay / Mercado Pago).
  - Panel de pedidos en tiempo real.

## Cómo correrlo

```bash
npm install
npm run dev
```

## Pendiente

- Reemplazar logo y fotos de productos placeholder por las reales (`src/assets/products/`, campo `image` en `menu.js`).
- Backend (Firebase/Supabase) para pedidos en tiempo real.
- Integración real de Uber Direct y pasarela de pago.
