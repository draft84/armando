@echo off
echo ============================================
echo   SYSF - Sistema de Gestion de Produccion
echo ============================================
echo.

echo [1/6] Iniciando contenedores Docker...
docker-compose up -d --build
if errorlevel 1 (
    echo Error al iniciar Docker
    pause
    exit /b 1
)
echo.

echo [2/6] Esperando a que los servicios esten listos...
timeout /t 10 /nobreak >nul
echo.

echo [3/6] Instalando dependencias de PHP...
docker-compose exec app composer install
echo.

echo [4/6] Generando clave de aplicacion...
docker-compose exec app php artisan key:generate
echo.

echo [5/6] Ejecutando migraciones y seeders...
docker-compose exec app php artisan migrate --seed
echo.

echo [6/6] Instalando dependencias de Node.js...
docker-compose exec node npm install
echo.

echo ============================================
echo   INSTALACION COMPLETADA!
echo ============================================
echo.
echo Acceda a la aplicacion en:
echo   - Aplicacion: http://localhost:8080
echo   - phpMyAdmin: http://localhost:8081
echo.
echo Credenciales por defecto:
echo   Email: admin@sysf.com
echo   Password: admin123
echo.
echo Para iniciar el servidor de desarrollo de Vite:
echo   docker-compose exec node npm run dev
echo.
pause
