# SYSF - Sistema de Gestión de Producción

Aplicación web completa para la gestión de producción de ingresos, salidas, formatos de producción y costos.

## 🚀 Tecnologías Utilizadas

- **Backend:** Laravel 10 + PHP 8.2
- **Frontend:** React 18 + Inertia.js
- **Base de Datos:** MySQL 8.0
- **Estilos:** TailwindCSS
- **Contenedor:** Docker + Docker Compose

## 📋 Requisitos

- Docker Desktop instalado y ejecutándose
- Al menos 4GB de RAM disponibles
- Puerto 8080, 8081 y 3306 disponibles

## 🔧 Instalación

### Opción 1: Script Automático (Recomendado)

1. Ejecute el script de instalación:
```bash
instalar.bat
```

2. Espere a que termine la instalación (puede tomar varios minutos)

### Opción 2: Instalación Manual

```bash
# 1. Iniciar contenedores
docker-compose up -d --build

# 2. Esperar 30 segundos y luego instalar dependencias
docker-compose exec app composer install

# 3. Generar clave de aplicación
docker-compose exec app php artisan key:generate

# 4. Crear directorios de storage
docker-compose exec app mkdir -p storage/framework/cache/data
docker-compose exec app mkdir -p storage/framework/sessions
docker-compose exec app mkdir -p storage/framework/views
docker-compose exec app mkdir -p storage/logs
docker-compose exec app chmod -R 777 storage

# 5. Ejecutar migraciones
docker-compose exec app php artisan migrate --seed

# 6. Instalar dependencias de Node
docker-compose exec node npm install

# 7. Compilar assets
docker-compose exec node npm run build
```

## 🌐 Accesos

### Aplicación Web
- **URL:** http://localhost:8080
- **Email:** admin@sysf.com
- **Contraseña:** admin123

### phpMyAdmin
- **URL:** http://localhost:8081
- **Usuario:** sysf_user
- **Contraseña:** sysf_password
- **Base de Datos:** sysf_db

## 📁 Estructura del Proyecto

```
SYSF/
├── app/
│   ├── Console/
│   ├── Exceptions/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── DashboardController.php
│   │   │   └── IngresoController.php
│   │   └── Middleware/
│   └── Models/
│       ├── Ingreso.php
│       └── User.php
├── database/
│   ├── migrations/
│   └── seeders/
├── docker/
│   ├── nginx/
│   └── php/
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Layouts/
│   │   │   └── AppLayout.jsx
│   │   └── Pages/
│   │       ├── Auth/
│   │       ├── Ingresos/
│   │       ├── Resumen/
│   │       └── Salidas/
│   └── views/
├── routes/
├── config/
└── docker-compose.yml
```

## ✨ Características Implementadas

### 1. Dashboard Principal
- 📊 Tarjetas con totales (Cajas, Items, Fecha más cercana, Promedio)
- 🔗 Accesos rápidos a todas las secciones
- 📋 Lista de ingresos recientes

### 2. Sección de Ingresos
- 📋 Tabla datatable con todas las columnas del Excel original:
  - ITEMS, FECHAEMP, LOTE, CODIGO, CAJA, ESPECIE, PRODUCTO, CALIDAD, FECHA ELAB, FECHAVENCI, CAJA2, TALLA
- ⚡ Fórmula replicada: **CAJA2 = CAJA** (se calcula automáticamente)
- 🔍 Búsqueda en tiempo real por: lote, código, especie, producto, calidad, talla
- 📄 Paginación configurable: 5, 10, 25, 50, 100 registros
- 📊 Resumen superior con totales de la fecha más cercana
- ➕ CRUD completo: Crear, Leer, Editar, Eliminar
- 🎨 Indicador visual de calidad (A=verde, B=amarillo, C=rojo)

### 3. Sidebar Menú
- 🎯 Menú acordeón contraíble
- 🎨 Iconos representativos por sección
- 👤 Nombre y email del usuario logueado
- 📱 Diseño responsivo

### 4. Header
- 🔔 Sistema de notificaciones
- 🌓 Toggle tema claro/oscuro (se guarda en localStorage)
- 🚪 Botón de cierre de sesión
- 👤 Menú de usuario

### 5. Autenticación
- 🔐 Login seguro
- 🔑 Credenciales por defecto configuradas
- 🔄 Protección de rutas

## 🛠️ Comandos Útiles

### Iniciar el proyecto
```bash
docker-compose up -d
```

### Detener el proyecto
```bash
docker-compose down
```

### Ver logs
```bash
# Todos los logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f app
docker-compose logs -f node
docker-compose logs -f mysql
```

### Acceder a los contenedores
```bash
# Laravel/PHP
docker-compose exec app bash

# Node.js
docker-compose exec node sh

# MySQL
docker-compose exec mysql bash

# phpMyAdmin
docker-compose exec phpmyadmin bash
```

### Desarrollo con Vite (Hot Reload)
```bash
docker-compose exec node npm run dev
```

### Compilar para producción
```bash
docker-compose exec node npm run build
```

### Limpiar y reiniciar
```bash
# Detener y eliminar volúmenes
docker-compose down -v

# Eliminar imágenes
docker-compose down -v --rmi all

# Reconstruir desde cero
docker-compose up -d --build
```

## 🔌 Base de Datos

### Tablas creadas:
1. **users** - Usuarios del sistema
2. **ingresos** - Registro de ingresos de producción

### Datos de prueba:
- 1 usuario administrador
- 51 registros de ingresos de ejemplo

## 🎨 Personalización

### Cambiar el logo
Edite el componente `Sidebar.jsx` y modifique el texto "SYSF"

### Agregar nuevas secciones
1. Cree la página en `resources/js/Pages/NuevaSeccion/`
2. Agregue la ruta en `routes/web.php`
3. Agregue el ítem en el menú del `Sidebar.jsx`

### Modificar colores
Edite `tailwind.config.js` y `resources/css/app.css`

## 🐛 Solución de Problemas

### Error: "Puerto ya en uso"
```bash
# Detener otros servicios usando el puerto
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Error: "No se puede conectar a MySQL"
```bash
# Reiniciar el contenedor de MySQL
docker-compose restart mysql

# Verificar logs
docker-compose logs mysql
```

### Error: "npm no encontrado"
```bash
# Reconstruir el contenedor de Node
docker-compose up -d --build node
```

### Error: "Clave de aplicación faltante"
```bash
docker-compose exec app php artisan key:generate
```

### Error: "Permisos de storage"
```bash
docker-compose exec app chmod -R 777 storage
docker-compose exec app chown -R www-data:www-data storage
```

## 📝 Notas Importantes

1. **Fórmula CAJA2:** Se replica automáticamente del Excel. Al guardar un ingreso, CAJA2 siempre será igual a CAJA.

2. **Tema Claro/Oscuro:** La preferencia se guarda en el navegador del usuario.

3. **Búsqueda en Tiempo Real:** Tiene un debounce de 300ms para optimizar el rendimiento.

4. **Datos de Prueba:** El seeder crea 51 registros de ejemplo. Puede modificarlos en `database/seeders/DatabaseSeeder.php`.

5. **Producción:** Para desplegar en producción, cambie `APP_DEBUG=false` en `.env` y use `npm run build`.

## 📄 Licencia

Este proyecto es de uso interno de la organización.

## 🤝 Soporte

Para problemas o consultas, contacte al equipo de desarrollo.

---

**Hecho con ❤️ usando Laravel + React + Docker**
