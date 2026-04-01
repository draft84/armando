<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(Request $request)
    {
        $totales = Ingreso::getTotales();
        
        $ingresosRecientes = Ingreso::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'totales' => $totales,
            'ingresosRecientes' => $ingresosRecientes,
        ]);
    }
}
