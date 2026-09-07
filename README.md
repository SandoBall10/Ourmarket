# Ourmarket / InmoMarket

Marketplace inmobiliario (Perú): clientes publican inmuebles, un admin los autoriza, y el resto busca, guarda favoritos o escribe al dueño.

## Requisitos

- JDK 21
- PostgreSQL en marcha (usuario `postgres` por defecto)
- Node.js 18+

Al levantar el backend se crea sola la base `marketplaceinmobiliario` si no existe, Hibernate arma las tablas, y se dejan dos cuentas compartidas del equipo.

## Cuentas del equipo

| Quién | Login | Contraseña | Rol |
|---|---|---|---|
| Admin | `admin` | `Admin123!` | MASTER |
| Usuario | `usuario@gmail.com` | `Cliente123!` | CLIENTE |

Cualquier compañero usa las mismas credenciales. No hace falta exportar ni pasarse dumps.

## Backend

```powershell
cd backend
mvn spring-boot:run
```

API: http://localhost:8080  
Swagger: http://localhost:8080/swagger-ui.html

Variables opcionales: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`.

## Frontend

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

SPA: http://localhost:5173

En `.env` define `VITE_API_URL` y, si usas el mapa del wizard de venta, `VITE_GOOGLE_MAPS_API_KEY`.

## Roles

- CLIENTE: publicar, buscar, favoritos, chats, perfil
- ADMIN / MASTER: dashboard, autorizar o rechazar publicaciones
- MASTER: además gestiona administradores
