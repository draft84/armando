<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Login en la raíz
Route::get('/', function () {
    return inertia('Auth/Login');
})->name('home');

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
    
    // Resumen
    Route::get('/resumen', [App\Http\Controllers\ResumenController::class, 'index'])->name('resumen.index');
    Route::get('/resumen/create', [App\Http\Controllers\ResumenController::class, 'create'])->name('resumen.create');
    Route::post('/resumen', [App\Http\Controllers\ResumenController::class, 'store'])->name('resumen.store');
    Route::get('/resumen/{resumen}', [App\Http\Controllers\ResumenController::class, 'show'])->name('resumen.show');
    Route::get('/resumen/{resumen}/edit', [App\Http\Controllers\ResumenController::class, 'edit'])->name('resumen.edit');
    Route::put('/resumen/{resumen}', [App\Http\Controllers\ResumenController::class, 'update'])->name('resumen.update');
    Route::delete('/resumen/{resumen}', [App\Http\Controllers\ResumenController::class, 'destroy'])->name('resumen.destroy');
    Route::post('/resumen/import', [App\Http\Controllers\ResumenController::class, 'import'])->name('resumen.import');
    
    // Salidas
    Route::get('/salidas', function () {
        return inertia('Salidas/Index');
    })->name('salidas.index');
});
