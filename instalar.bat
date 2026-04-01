@echo off
echo ============================================
echo   SYSF - Sistema de Gestion de Produccion
echo ============================================
echo.
echo Este script instalara y configurara todo el proyecto.
echo.
pause

echo.
echo [1/8] Creando archivo .env...
if not exist .env (
    copy .env .env
    echo .env creado.
) else (
    echo .env ya existe.
)

echo.
echo [2/8] Iniciando contenedores Docker...
docker-compose up -d --build
if errorlevel 1 (
    echo Error al iniciar Docker. Verifique que Docker Desktop este instalado y ejecutandose.
    pause
    exit /b 1
)

echo.
echo [3/8] Esperando a que los servicios esten listos (30 segundos)...
timeout /t 30 /nobreak >nul

echo.
echo [4/8] Instalando dependencias de PHP...
docker-compose exec -T app composer install --no-interaction

echo.
echo [5/8] Generando clave de aplicacion...
docker-compose exec -T app php artisan key:generate

echo.
echo [6/8] Creando directorios de storage...
docker-compose exec -T app mkdir -p storage/framework/cache/data
docker-compose exec -T app mkdir -p storage/framework/sessions
docker-compose exec -T app mkdir -p storage/framework/views
docker-compose exec -T app mkdir -p storage/logs
docker-compose exec -T app chmod -R 777 storage

echo.
echo [7/8] Ejecutando migraciones y seeders...
docker-compose exec -T app php artisan migrate --seed

echo.
echo [8/8] Instalando dependencias de Node.js...
docker-compose exec -T node npm install

echo.
echo ============================================
echo   INSTALACION COMPLETADA!
echo ============================================
echo.
echo Para iniciar el servidor de desarrollo:
echo   1. Ejecute: docker-compose exec node npm run dev
echo   2. O ejecute el archivo: iniciar-dev.bat
echo.
echo Acceda a la aplicacion en:
echo   - Aplicacion: http://localhost:8080
echo   - phpMyAdmin: http://localhost:8081
echo.
echo Credenciales por defecto:
echo   Email: admin@sysf.com
echo   Password: admin123
echo.
pause
