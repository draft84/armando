<?php

namespace App\Http\Controllers;

use App\Models\CajaInventario;
use App\Models\Ingreso;
use App\Models\Salida;
use App\Models\Resumen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventarioCajasController extends Controller
{
    /**
     * Mostrar inventario de cajas (solo EN_STOCK)
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $search = $request->get('search', '');
        $filterEspecie = $request->get('filterEspecie', '');
        $filterLote = $request->get('filterLote', '');
        $filterCuarto = $request->get('filterCuarto', '');

        $query = CajaInventario::query()->enStock();

        // Filtros
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('caja_numero', 'like', "%{$search}%")
                    ->orWhere('codigo_producto', 'like', "%{$search}%")
                    ->orWhere('lote', 'like', "%{$search}%")
                    ->orWhere('especie', 'like', "%{$search}%")
                    ->orWhere('producto', 'like', "%{$search}%");
            });
        }

        if ($filterEspecie) {
            $query->where('especie', $filterEspecie);
        }
        if ($filterLote) {
            $query->where('lote', $filterLote);
        }
        if ($filterCuarto) {
            $query->where('cuarto', $filterCuarto);
        }

        $cajas = $query->orderBy('caja_numero', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        $totales = CajaInventario::getTotalesStock();

        // Especies únicas para filtro
        $especies = CajaInventario::enStock()->distinct()->pluck('especie')->sort()->values();
        $lotes = CajaInventario::enStock()->distinct()->pluck('lote')->sort()->values();
        $cuartos = CajaInventario::enStock()->distinct()->pluck('cuarto')->sort()->values();

        return Inertia::render('InventarioCajas/Index', [
            'cajas' => $cajas,
            'totales' => $totales,
            'filters' => [
                'search' => $search,
                'filterEspecie' => $filterEspecie,
                'filterLote' => $filterLote,
                'filterCuarto' => $filterCuarto,
            ],
            'especies' => $especies,
            'lotes' => $lotes,
            'cuartos' => $cuartos,
        ]);
    }

    /**
     * Buscar caja por número
     */
    public function buscar(Request $request)
    {
        $cajaNumero = $request->get('caja_numero', '');
        $caja = null;

        if ($cajaNumero) {
            $caja = CajaInventario::where('caja_numero', $cajaNumero)->first();

            // Si existe, cargar relaciones
            if ($caja) {
                $caja->load(['ingreso', 'salida']);
            }
        }

        return Inertia::render('InventarioCajas/Buscar', [
            'caja' => $caja,
            'cajaNumero' => $cajaNumero,
        ]);
    }

    /**
     * Detalle de una caja específica
     */
    public function show($id)
    {
        $caja = CajaInventario::with(['ingreso', 'salida'])->findOrFail($id);

        return Inertia::render('InventarioCajas/Show', [
            'caja' => $caja,
        ]);
    }

    /**
     * Cajas por código de producto (para el Resumen)
     */
    public function porCodigo($codigo)
    {
        $enStock = CajaInventario::codigo($codigo)->enStock()->get();
        $vendidas = CajaInventario::codigo($codigo)->where('estado', 'VENDIDA')->get();

        return response()->json([
            'en_stock' => $enStock,
            'vendidas' => $vendidas,
            'total_stock' => $enStock->count(),
            'libras_stock' => $enStock->sum('libras'),
        ]);
    }
}
