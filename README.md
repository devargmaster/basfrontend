# BAS Inventory Frontend

Este proyecto es un frontend sencillo para consumir el backend del inventario disponible en [basbackend](https://github.com/devargmaster/basbackend).

## Configuración

1. Copia `.env.example` a `.env` y ajusta `VITE_API_BASE_URL` con la URL del backend.
2. Instala las dependencias con `npm install`.
3. Ejecuta el entorno de desarrollo con `npm run dev`.
### Instalación en macOS

1. Instala [Node.js](https://nodejs.org/) que incluye npm. Puedes usar Homebrew
   con `brew install node`.
2. En la raíz del proyecto ejecuta `npm install` para descargar las dependencias
   (incluyendo Vite, Tailwind y Material UI).
3. Copia el archivo `.env.example` a `.env` y ajusta `VITE_API_BASE_URL` con la
   URL de tu backend.
4. Inicia la aplicación con `npm run dev` y abre `http://localhost:5173` en tu
   navegador.

Las dependencias de estilos (Tailwind y Material UI) se cargan desde CDN para
facilitar la configuración.
