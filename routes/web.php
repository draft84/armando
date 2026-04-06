<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\SalidaController;
use App\Http\Controllers\ResumenController;
use App\Http\Controllers\InventarioCajasController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Login en la raíz
Route::get('/', function () {
    return inertia('Auth/Login');
})->name('login');

// Rutas de autenticación
Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Rutas protegidas
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Ingresos
    Route::get('/ingresos', [IngresoController::class, 'index'])->name('ingresos.index');
    Route::get('/ingresos/create', [IngresoController::class, 'create'])->name('ingresos.create');
    Route::post('/ingresos', [IngresoController::class, 'store'])->name('ingresos.store');
    Route::get('/ingresos/{ingreso}', [IngresoController::class, 'show'])->name('ingresos.show');
    Route::get('/ingresos/{ingreso}/edit', [IngresoController::class, 'edit'])->name('ingresos.edit');
    Route::put('/ingresos/{ingreso}', [IngresoController::class, 'update'])->name('ingresos.update');
    Route::delete('/ingresos/{ingreso}', [IngresoController::class, 'destroy'])->name('ingresos.destroy');
    Route::post('/ingresos/import', [IngresoController::class, 'import'])->name('ingresos.import');

    // Salidas
    Route::get('/salidas', [SalidaController::class, 'index'])->name('salidas.index');
    Route::get('/salidas/create', [SalidaController::class, 'create'])->name('salidas.create');
    Route::post('/salidas', [SalidaController::class, 'store'])->name('salidas.store');
    Route::get('/salidas/{salida}', [SalidaController::class, 'show'])->name('salidas.show');
    Route::get('/salidas/{salida}/edit', [SalidaController::class, 'edit'])->name('salidas.edit');
    Route::put('/salidas/{salida}', [SalidaController::class, 'update'])->name('salidas.update');
    Route::delete('/salidas/{salida}', [SalidaController::class, 'destroy'])->name('salidas.destroy');
    Route::post('/salidas/import', [SalidaController::class, 'import'])->name('salidas.import');

    // Resumen
    Route::get('/resumen', [ResumenController::class, 'index'])->name('resumen.index');
    Route::get('/resumen/create', [ResumenController::class, 'create'])->name('resumen.create');
    Route::post('/resumen', [ResumenController::class, 'store'])->name('resumen.store');
    Route::get('/resumen/{resumen}', [ResumenController::class, 'show'])->name('resumen.show');
    Route::get('/resumen/{resumen}/edit', [ResumenController::class, 'edit'])->name('resumen.edit');
    Route::put('/resumen/{resumen}', [ResumenController::class, 'update'])->name('resumen.update');
    Route::delete('/resumen/{resumen}', [ResumenController::class, 'destroy'])->name('resumen.destroy');
    Route::post('/resumen/import', [ResumenController::class, 'import'])->name('resumen.import');

    // Inventario de Cajas
    Route::get('/inventario-cajas', [InventarioCajasController::class, 'index'])->name('inventario-cajas.index');
    Route::get('/inventario-cajas/{id}', [InventarioCajasController::class, 'show'])->name('inventario-cajas.show');
    Route::get('/buscar-caja', [InventarioCajasController::class, 'buscar'])->name('buscar-caja.index');
    Route::get('/api/cajas/codigo/{codigo}', [InventarioCajasController::class, 'porCodigo']);
});
