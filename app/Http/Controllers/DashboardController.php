<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use App\Models\Salida;
use App\Models\Resumen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        // Valores por defecto seguros
        $totalesIngresos = ['total_cajas' => 0, 'total_items' => 0, 'fecha_mas_cercana' => null];
        $totalesSalidas = ['total_cajas' => 0, 'total_items' => 0, 'fecha_mas_cercana' => null];
        $totalesResumen = ['total_registros' => 0, 'total_ingresos' => 0, 'total_salidas' => 0, 'total_stock' => 0];
        $ingresosRecientes = collect();
        $salidasRecientes = collect();
        $topStock = collect();

        try {
            $totalesIngresos = Ingreso::getTotales();
            $ingresosRecientes = Ingreso::orderBy('created_at', 'desc')->limit(5)->get();
        } catch (\Exception $e) {
            \Log::warning('Dashboard Ingresos: ' . $e->getMessage());
        }

        try {
            $totalesSalidas = Salida::getTotales();
            $salidasRecientes = Salida::orderBy('created_at', 'desc')->limit(5)->get();
        } catch (\Exception $e) {
            \Log::warning('Dashboard Salidas: ' . $e->getMessage());
        }

        try {
            $totalesResumen = Resumen::getTotales();
            $topStock = Resumen::orderBy('stock', 'desc')->limit(5)->get();
        } catch (\Exception $e) {
            \Log::warning('Dashboard Resumen: ' . $e->getMessage());
        }

        return Inertia::render('Dashboard', [
            'totalesIngresos' => $totalesIngresos,
            'totalesSalidas' => $totalesSalidas,
            'totalesResumen' => $totalesResumen,
            'ingresosRecientes' => $ingresosRecientes,
            'salidasRecientes' => $salidasRecientes,
            'topStock' => $topStock,
        ]);
    }
}
