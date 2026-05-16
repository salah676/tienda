# Debt Manager SaaS

Sistema SaaS de gestión de deudas para tiendas en Marruecos.

## 🚀 Demo

**Web App:** https://debt-manager.vercel.app
**Mercado:** Marruecos (WafaCash, CashPlus)

## ✨ Características

- **Panel Admin:** Gestión de clientes, productos, deudas y pagos
- **Panel SuperAdmin:** Gestión multi-tenant, planes de suscripción
- **App Cliente:** Estado de cuenta, historial, pagos móviles
- **Pagos:** Integración con WafaCash y CashPlus
- **Offline:** Sincronización offline con Dexie.js
- **Reportes:** Exportación en CSV y HTML

## 🛠️ Tech Stack

| Componente | Tecnología |
|------------|-------------|
| Frontend Web | Next.js 14 + React |
| Estilos | Tailwind CSS |
| Backend | Next.js API Routes |
| Base de Datos | PostgreSQL + Prisma |
| Auth | NextAuth.js |
| Mobile | Expo (React Native) |
| Offline | Dexie.js + Service Workers |

## 📦 Instalación

### Requisitos
- Node.js 18+
- PostgreSQL (Neon/Supabase)
- npm o yarn

### 1. Clonar y configurar

```bash
# Clonar repositorio
git clone <repo-url>
cd debt-manager-saas

# Instalar dependencias
npm install

# Generar Prisma client
npm run db:generate

# Copiar variables de entorno
cp .env.example .env.local
```

### 2. Configurar variables (.env.local)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Inicializar base de datos

```bash
npm run db:push
```

### 4. Ejecutar

```bash
npm run dev
```

## 🚀 Deploy a Vercel

### 1. Conectar repositorio

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Configurar variables en Vercel

Agregar en Settings > Environment Variables:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`

### 3. Deploy producción

```bash
vercel --prod
```

## 📱 App Móvil (Expo)

```bash
cd apps/mobile
npm install
npx expo start
```

### Generar APK Android

```bash
cd apps/mobile
npx expo run:android --variant release
```

## 🔐 APIs

### Admin APIs
- `POST /api/tenants` - Crear tienda
- `GET/POST /api/clients` - Clientes
- `GET/POST /api/products` - Productos
- `GET/POST /api/debts` - Deudas
- `GET/POST /api/payments` - Pagos
- `GET/POST /api/reports/*` - Reportes

### Cliente APIs
- `POST /api/client/login` - Login cliente
- `GET /api/client/debts` - Deudas cliente
- `GET /api/client/payments` - Pagos cliente

### Pagos
- `POST /api/payments/gateway/wafacash` - WafaCash
- `POST /api/payments/gateway/cashplus` - CashPlus

## 💰 Costos (Gratuitos)

- **Hosting:** Vercel (free tier)
- **DB:** Neon/Supabase (free tier)
- **Mobile:** Expo (free)
- **Dominio:** .vercel.app incluido

## 📄 Licencia

MIT