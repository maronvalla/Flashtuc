# Walkthrough: FlashTuc 100% Free

La plataforma ha sido optimizada para operar en un stack completamente gratuito y con persistencia local.

## Stack Tecnológico 100% Free
- **Backend**: Node.js + SQLite (Prisma).
- **Frontend**: React + Vite + Tailwind 4.
- **Deploy Backend**: [Railway](https://railway.app/) (Tier Gratuito).
- **Deploy Frontend**: [Vercel](https://vercel.com/) (Tier Gratuito).

## Nuevas Funcionalidades
1. **Optimización de Rutas**: Implementación de algoritmo **Nearest-Neighbor**. Al optimizar una ruta, el sistema calcula la secuencia más eficiente de paradas basándose en coordenadas geográficas (lat/lng), comenzando desde el centro logístico.
2. **Segregación de Pagos**: El sistema ahora calcula automáticamente el split de dinero:
   - `Pago Empresa`: Costo del envío + comisión por gestión de efectivo (5%).
   - `Pago Remitente`: El monto neto a entregar al cliente tras cobrar el envío (COD - Comisión).
3. **Persistencia SQLite**: Base de datos ligera en un archivo local `dev.db`, ideal para MVPs sin costo de servidor DB.

---

## Guía de Despliegue Paso a Paso

### 1. Backend en Railway
1. Sube el código a GitHub.
2. Crea un nuevo proyecto en **Railway** desde tu repo.
3. En la pestaña **Settings** del servicio, añade un **Volume** (Ej: `/data`) para que el archivo SQLite sea persistente.
4. Define las variables de entorno en Railway:
   - `DATABASE_URL`: `file:/data/flashtuc.db` (asegúrate que la ruta coincida con el volumen).
   - `PORT`: `8080`.
5. Railway ejecutará `npm start` automáticamente.

### 2. Frontend en Vercel
1. Crea un nuevo proyecto en **Vercel** vinculado a tu repo.
2. Configura el **Root Directory** como `frontend`.
3. Añade la variable de entorno:
   - `VITE_API_URL`: La URL que te proporcione Railway (ej: `https://flashtuc-api.up.railway.app`).
4. Haz click en **Deploy**.

---

## Validación de Lógica
- [x] Migración SQLite completada exitosamente.
- [x] Lógica de pagos (split 5%) implementada en `createEnvio`.
- [x] Algoritmo Nearest-Neighbor funcional en `optimizarRuta`.
- [x] App configurada para escuchar en `process.env.PORT`.
