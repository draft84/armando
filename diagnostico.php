<?php

echo "=== DIAGNÓSTICO COMPLETO DE IMPORTACIÓN ===\n\n";

// 1. Verificar extensiones de PHP
echo "1. Verificando extensiones requeridas:\n";
$extensions = ['zip', 'xml', 'gd', 'mbstring', 'ctype', 'fileinfo', 'iconv'];
foreach ($extensions as $ext) {
    $status = extension_loaded($ext) ? '✓' : '✗';
    echo "   $status $ext\n";
}

// 2. Verificar límites
echo "\n2. Límites de PHP:\n";
echo "   max_execution_time: " . ini_get('max_execution_time') . "\n";
echo "   upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "   post_max_size: " . ini_get('post_max_size') . "\n";
echo "   memory_limit: " . ini_get('memory_limit') . "\n";

// 3. Verificar archivo Excel
echo "\n3. Verificando archivo INGRESOS.xlsx:\n";
$file = 'INGRESOS.xlsx';
if (file_exists($file)) {
    echo "   ✓ Archivo existe\n";
    echo "   Tamaño: " . (filesize($file) / 1024 / 1024) . " MB\n";
    echo "   Legible: " . (is_readable($file) ? 'Sí' : 'No') . "\n";
} else {
    echo "   ✗ Archivo no encontrado\n";
}

// 4. Verificar ruta existe
echo "\n4. Verificando ruta /ingresos/import:\n";
try {
    require __DIR__ . '/vendor/autoload.php';
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    $routes = \Illuminate\Support\Facades\Route::getRoutes();
    $found = false;
    foreach ($routes as $route) {
        if ($route->getName() === 'ingresos.import') {
            echo "   ✓ Ruta encontrada: " . $route->uri() . "\n";
            echo "   Método: " . implode(', ', $route->methods()) . "\n";
            echo "   Controller: " . ($route->getActionName() ?? 'N/A') . "\n";
            $found = true;
            break;
        }
    }
    if (!$found) {
        echo "   ✗ Ruta no encontrada\n";
    }
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n";
}

// 5. Verificar base de datos
echo "\n5. Verificando base de datos:\n";
try {
    $db = \Illuminate\Support\Facades\DB::connection();
    echo "   ✓ Conexión exitosa\n";
    echo "   Base de datos: " . $db->getDatabaseName() . "\n";
    echo "   Host: " . $db->getConfig('host') . "\n";
    
    $tableExists = \Illuminate\Support\Facades\Schema::hasTable('ingresos');
    echo "   Tabla ingresos: " . ($tableExists ? 'Existe ✓' : 'No existe ✗') . "\n";
    
    if ($tableExists) {
        $count = \App\Models\Ingreso::count();
        echo "   Registros actuales: $count\n";
    }
} catch (Exception $e) {
    echo "   ✗ Error de conexión: " . $e->getMessage() . "\n";
}

// 6. Verificar controlador
echo "\n6. Verificando controlador:\n";
$controllerFile = 'app/Http/Controllers/IngresoController.php';
if (file_exists($controllerFile)) {
    echo "   ✓ Controlador existe\n";
    require_once __DIR__ . '/' . $controllerFile;
    if (method_exists('App\Http\Controllers\IngresoController', 'import')) {
        echo "   ✓ Método import() existe\n";
    } else {
        echo "   ✗ Método import() no existe\n";
    }
} else {
    echo "   ✗ Controlador no encontrado\n";
}

// 7. Verificar logs
echo "\n7. Últimos errores en logs:\n";
$logFile = 'storage/logs/laravel.log';
if (file_exists($logFile)) {
    $lines = file($logFile);
    $recentErrors = array_filter($lines, function($line) {
        return strpos($line, '.ERROR') !== false || strpos($line, 'import') !== false;
    });
    $recentErrors = array_slice($recentErrors, -5);
    if (empty($recentErrors)) {
        echo "   No hay errores recientes\n";
    } else {
        foreach ($recentErrors as $error) {
            echo "   " . trim($error) . "\n";
        }
    }
} else {
    echo "   No hay archivo de logs\n";
}

echo "\n=== FIN DEL DIAGNÓSTICO ===\n";
