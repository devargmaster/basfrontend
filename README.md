# BAS Inventory Frontend

Este proyecto es un frontend sencillo para consumir el backend del inventario disponible en [basbackend](https://github.com/devargmaster/basbackend).

## Configuración

1. Copia `.env.example` a `.env` y ajusta `VITE_API_BASE_URL` con la URL del backend.
2. Instala las dependencias con `npm install`.
3. Ejecuta el entorno de desarrollo con `npm run dev`.

## Estructura

- `index.html` punto de entrada de la aplicación.
- `src/` contiene los componentes de React.
- `vite.config.js` configuración mínima de Vite.

El componente `ProductList` obtiene los productos desde `${VITE_API_BASE_URL}/products`.