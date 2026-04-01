<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngresoController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Ingresos/Create');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 5);
        $search = $request->get('search', '');

        $query = Ingreso::query();

        // Búsqueda en tiempo real
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('lote', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('especie', 'like', "%{$search}%")
                    ->orWhere('producto', 'like', "%{$search}%")
                    ->orWhere('calidad', 'like', "%{$search}%")
                    ->orWhere('talla', 'like', "%{$search}%");
            });
        }

        $ingresos = $query->orderBy('fechaemp', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Totales del resumen
        $totales = Ingreso::getTotales();

        return Inertia::render('Ingresos/Index', [
            'ingresos' => $ingresos,
            'totales' => $totales,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|integer',
            'fechaemp' => 'required|date',
            'lote' => 'required|string|max:255',
            'codigo' => 'required|string|max:255',
            'caja' => 'required|integer',
            'especie' => 'required|string|max:255',
            'producto' => 'required|string|max:255',
            'calidad' => 'required|string|max:10',
            'fecha_elab' => 'required|date',
            'fechavenci' => 'required|date',
            'talla' => 'required|string|max:50',
            'uds' => 'nullable|integer',
            'libras' => 'nullable|numeric',
            'quees' => 'nullable|string|max:255',
            'empaque' => 'nullable|string|max:255',
            'cuarto' => 'nullable|integer',
            'posicion' => 'nullable|string|max:255',
            'tarima' => 'nullable|integer',
        ]);

        Ingreso::create($validated);

        return redirect()->route('ingresos.index')
            ->with('success', 'Ingreso creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ingreso $ingreso)
    {
        return Inertia::render('Ingresos/Show', [
            'ingreso' => $ingreso,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ingreso $ingreso)
    {
        return Inertia::render('Ingresos/Edit', [
            'ingreso' => $ingreso,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ingreso $ingreso)
    {
        $validated = $request->validate([
            'items' => 'required|integer',
            'fechaemp' => 'required|date',
            'lote' => 'required|string|max:255',
            'codigo' => 'required|string|max:255',
            'caja' => 'required|integer',
            'especie' => 'required|string|max:255',
            'producto' => 'required|string|max:255',
            'calidad' => 'required|string|max:10',
            'fecha_elab' => 'required|date',
            'fechavenci' => 'required|date',
            'talla' => 'required|string|max:50',
            'uds' => 'nullable|integer',
            'libras' => 'nullable|numeric',
            'quees' => 'nullable|string|max:255',
            'empaque' => 'nullable|string|max:255',
            'cuarto' => 'nullable|integer',
            'posicion' => 'nullable|string|max:255',
            'tarima' => 'nullable|integer',
        ]);

        $ingreso->update($validated);

        return redirect()->route('ingresos.index')
            ->with('success', 'Ingreso actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ingreso $ingreso)
    {
        $ingreso->delete();

        return redirect()->route('ingresos.index')
            ->with('success', 'Ingreso eliminado exitosamente.');
    }
}
