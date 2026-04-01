<?php

namespace App\Http\Controllers;

use App\Models\Resumen;
use App\Models\Ingreso;
use App\Models\Salida;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResumenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 5);
        $search = $request->get('search', '');

        $query = Resumen::query();

        // Búsqueda en tiempo real
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('codigo', 'like', "%{$search}%")
                    ->orWhere('especie', 'like', "%{$search}%")
                    ->orWhere('producto', 'like', "%{$search}%")
                    ->orWhere('calidad', 'like', "%{$search}%")
                    ->orWhere('talla', 'like', "%{$search}%");
            });
        }

        $resumens = $query->orderBy('codigo', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        // Totales del resumen
        $totales = Resumen::getTotales();

        return Inertia::render('Resumen/Index', [
            'resumens' => $resumens,
            'totales' => $totales,
            'filters' => [
                'search' => $search,
                'perPage' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Resumen/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item' => 'required|integer',
            'codigo' => 'required|string|max:255|unique:resumens,codigo',
            'especie' => 'required|string|max:255',
            'producto' => 'required|string|max:255',
            'calidad' => 'required|string|max:50',
            'estado' => 'nullable|string|max:50',
            'talla' => 'required|string|max:50',
            'empaque' => 'required|string|max:255',
            'ingresos' => 'nullable|integer',
            'salidas' => 'nullable|integer',
            'lb' => 'nullable|numeric',
            'observacion_organoleptica' => 'nullable|string',
        ]);

        Resumen::create($validated);

        return redirect()->route('resumen.index')
            ->with('success', 'Registro creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Resumen $resumen)
    {
        return Inertia::render('Resumen/Show', [
            'resumen' => $resumen,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resumen $resumen)
    {
        return Inertia::render('Resumen/Edit', [
            'resumen' => $resumen,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resumen $resumen)
    {
        $validated = $request->validate([
            'item' => 'required|integer',
            'codigo' => 'required|string|max:255|unique:resumens,codigo,' . $resumen->id,
            'especie' => 'required|string|max:255',
            'producto' => 'required|string|max:255',
            'calidad' => 'required|string|max:50',
            'estado' => 'nullable|string|max:50',
            'talla' => 'required|string|max:50',
            'empaque' => 'required|string|max:255',
            'ingresos' => 'nullable|integer',
            'salidas' => 'nullable|integer',
            'lb' => 'nullable|numeric',
            'observacion_organoleptica' => 'nullable|string',
        ]);

        $resumen->update($validated);

        return redirect()->route('resumen.index')
            ->with('success', 'Registro actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resumen $resumen)
    {
        $resumen->delete();

        return redirect()->route('resumen.index')
            ->with('success', 'Registro eliminado exitosamente.');
    }

    /**
     * Importar desde Excel
     */
    public function import(Request $request)
    {
        // Aquí se implementará la importación desde Excel
        return redirect()->route('resumen.index')
            ->with('success', 'Datos importados exitosamente.');
    }
}
