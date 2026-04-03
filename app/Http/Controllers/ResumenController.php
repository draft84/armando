<?php

namespace App\Http\Controllers;

use App\Models\Resumen;
use App\Models\Ingreso;
use App\Models\Salida;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

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
        Log::info('=== Inicio de importación RESUMEN ===');
        Log::info('Método HTTP: ' . $request->method());

        if (!$request->hasFile('file')) {
            Log::error('No se recibió ningún archivo en resumen/import');
            return response()->json([
                'success' => false,
                'message' => 'No se recibió ningún archivo. Por favor selecciona un archivo Excel.',
            ], 400);
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            $file = $request->file('file');
            Log::info('Archivo recibido: ' . $file->getClientOriginalName());
            Log::info('Tamaño: ' . $file->getSize() . ' bytes');

            if (!file_exists($file->getRealPath())) {
                throw new \Exception('El archivo no se pudo leer correctamente.');
            }

            // Cargar archivo con PhpSpreadsheet usando getCalculatedValue para fórmulas
            Log::info('Cargando archivo con PhpSpreadsheet...');
            $spreadsheet = IOFactory::load($file->getRealPath());
            $worksheet = $spreadsheet->getActiveSheet();

            $highestRow = $worksheet->getHighestRow();
            $highestColumn = $worksheet->getHighestColumn();
            $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);

            $rows = [];
            for ($row = 1; $row <= $highestRow; $row++) {
                $rowData = [];
                for ($col = 1; $col <= $highestColumnIndex; $col++) {
                    $cell = $worksheet->getCellByColumnAndRow($col, $row);
                    $rowData[] = $cell->getCalculatedValue();
                }
                $rows[] = $rowData;
            }

            Log::info('Total filas leídas: ' . count($rows));

            if (empty($rows)) {
                throw new \Exception('El archivo Excel está vacío.');
            }

            // Mostrar encabezados para debugging
            if (count($rows) > 0) {
                Log::info('Encabezados: ' . json_encode($rows[0]));
            }

            // Buscar la fila de encabezados (ITEM, CODIGO, ESPECIE, etc.)
            $headerRowIndex = null;
            foreach ($rows as $index => $row) {
                $firstCell = trim($row[0] ?? '');
                if (strtoupper($firstCell) === 'ITEM' || strtoupper($firstCell) === 'ITEMS') {
                    $headerRowIndex = $index;
                    break;
                }
            }

            if ($headerRowIndex === null) {
                // Si no encuentra encabezados, asumir que los datos empiezan en la fila 6 (índice 5)
                // como en el archivo RESUMEN.xlsx original
                $headerRowIndex = 4; // Fila 5 en Excel = índice 4
                Log::warning('No se encontraron encabezados estándar, usando fila 5 como encabezados');
            }

            Log::info('Fila de encabezados encontrada en índice: ' . $headerRowIndex);
            Log::info('Encabezados detectados: ' . json_encode($rows[$headerRowIndex]));

            // Eliminar filas hasta los encabezados inclusive
            $dataRows = array_slice($rows, $headerRowIndex + 1);
            Log::info('Filas de datos después de recortar: ' . count($dataRows));

            $creados = 0;
            $actualizados = 0;
            $errores = [];
            $filaActual = $headerRowIndex + 2; // +2 porque headerRowIndex es 0-based y sumamos 1 para la fila Excel

            foreach ($dataRows as $index => $row) {
                // Saltar filas vacías
                if (empty(array_filter($row, function($cell) { return $cell !== null && $cell !== ''; }))) {
                    $filaActual++;
                    continue;
                }

                try {
                    // Estructura: 0:ITEM, 1:CODIGO, 2:ESPECIE, 3:PRODUCTO, 4:CALIDAD,
                    // 5:ESTADO, 6:TALLA, 7:EMPAQUE, 8:INGRESOS, 9:SALIDAS, 10:STOCK, 11:LB, 12:OBSERVACION

                    $codigo = trim($row[1] ?? '');
                    if (empty($codigo)) {
                        throw new \Exception('El campo CODIGO está vacío.');
                    }

                    $data = [
                        'item' => is_numeric($row[0] ?? null) ? (int) $row[0] : null,
                        'codigo' => $codigo,
                        'especie' => trim($row[2] ?? ''),
                        'producto' => trim($row[3] ?? ''),
                        'calidad' => trim($row[4] ?? ''),
                        'estado' => trim($row[5] ?? 'IQF'),
                        'talla' => trim($row[6] ?? ''),
                        'empaque' => trim($row[7] ?? ''),
                        'ingresos' => is_numeric($row[8] ?? null) ? (int) $row[8] : 0,
                        'salidas' => is_numeric($row[9] ?? null) ? (int) $row[9] : 0,
                        'lb' => is_numeric($row[11] ?? null) ? $row[11] : null,
                        'observacion_organoleptica' => trim($row[12] ?? ''),
                    ];

                    // STOCK se calcula automáticamente en el modelo (INGRESOS - SALIDAS)

                    Log::info("Fila {$filaActual} - Procesando: CODIGO={$data['codigo']}, ESPECIE={$data['especie']}");

                    // Buscar si ya existe por código (upsert)
                    $existing = Resumen::where('codigo', $data['codigo'])->first();

                    if ($existing) {
                        $existing->update($data);
                        $actualizados++;
                        Log::info("Fila {$filaActual} - Registro actualizado");
                    } else {
                        Resumen::create($data);
                        $creados++;
                        Log::info("Fila {$filaActual} - Registro creado");
                    }
                } catch (\Exception $e) {
                    $mensajeError = "Fila {$filaActual}: " . $e->getMessage();
                    Log::error($mensajeError);
                    $errores[] = $mensajeError;
                }

                $filaActual++;
            }

            Log::info("=== Fin importación RESUMEN - Creados: {$creados}, Actualizados: {$actualizados}, Errores: " . count($errores) . ' ===');

            if ($request->wantsJson() || $request->ajax()) {
                $message = "Se importaron {$creados} registros nuevos y se actualizaron {$actualizados} existentes.";
                if (!empty($errores)) {
                    $message .= " Hubo " . count($errores) . " errores.";
                }
                return response()->json([
                    'success' => true,
                    'message' => $message,
                    'count' => $creados + $actualizados,
                    'errores' => array_slice($errores, 0, 10),
                ]);
            }

            return redirect()->route('resumen.index')
                ->with('success', "Se importaron {$creados} registros nuevos y se actualizaron {$actualizados} existentes.");
        } catch (\Exception $e) {
            Log::error('Error general en import resumen: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al importar: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->route('resumen.index')
                ->with('error', 'Error al importar: ' . $e->getMessage());
        }
    }
}
