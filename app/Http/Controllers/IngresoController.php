<?php

namespace App\Http\Controllers;

use App\Models\Ingreso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;

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

    /**
     * Importar desde Excel
     */
    public function import(Request $request)
    {
        Log::info('=== Inicio de importación ===');
        Log::info('Método HTTP: ' . $request->method());
        Log::info('Headers: ' . json_encode($request->headers->all()));

        // Verificar si se recibió un archivo
        if (!$request->hasFile('file')) {
            Log::error('No se recibió ningún archivo en la petición');
            Log::info('Files en request: ' . json_encode($request->allFiles()));
            return response()->json([
                'success' => false,
                'message' => 'No se recibió ningún archivo. Por favor selecciona un archivo Excel.',
            ], 400);
        }

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240', // máximo 10MB
        ]);

        try {
            $file = $request->file('file');
            Log::info('Archivo recibido: ' . $file->getClientOriginalName());
            Log::info('Tamaño del archivo: ' . $file->getSize() . ' bytes');
            Log::info('Ruta temporal: ' . $file->getRealPath());
            Log::info('MIME type: ' . $file->getMimeType());

            // Verificar que el archivo sea legible
            if (!file_exists($file->getRealPath())) {
                throw new \Exception('El archivo no se pudo leer correctamente.');
            }

            // Cargar el archivo con PhpSpreadsheet
            Log::info('Cargando archivo con PhpSpreadsheet...');
            $spreadsheet = IOFactory::load($file->getRealPath());
            $worksheet = $spreadsheet->getActiveSheet();

            // Obtener los valores calculados de las fórmulas, no las fórmulas en sí
            $highestRow = $worksheet->getHighestRow();
            $highestColumn = $worksheet->getHighestColumn();
            $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);

            $rows = [];
            for ($row = 1; $row <= $highestRow; $row++) {
                $rowData = [];
                for ($col = 1; $col <= $highestColumnIndex; $col++) {
                    $cell = $worksheet->getCellByColumnAndRow($col, $row);
                    // Usar getCalculatedValue() para obtener el valor de las fórmulas
                    $rowData[] = $cell->getCalculatedValue();
                }
                $rows[] = $rowData;
            }

            Log::info('Total de filas leídas: ' . count($rows));

            // Verificar que el archivo tenga datos
            if (empty($rows)) {
                throw new \Exception('El archivo Excel está vacío.');
            }

            // Mostrar los encabezados (primera fila)
            if (count($rows) > 0) {
                Log::info('Encabezados del archivo: ' . json_encode($rows[0]));
            }

            // Eliminar la primera fila (encabezados)
            array_shift($rows);

            Log::info('Total de filas de datos (excluyendo encabezados): ' . count($rows));

            $ingresosCreados = 0;
            $errores = [];
            $filaActual = 2; // Empezamos en la fila 2 (la 1 es encabezados)

            foreach ($rows as $index => $row) {
                // Saltar filas vacías
                if (empty(array_filter($row, function($cell) { return $cell !== null && $cell !== ''; }))) {
                    Log::info("Fila {$filaActual} saltada (vacía)");
                    $filaActual++;
                    continue;
                }

                try {
                    // Estructura del Excel:
                    // 0:ITEMS, 1:FECHAEMP, 2:LOTE, 3:CODIGO, 4:CAJA, 5:ESPECIE, 6:PRODUCTO,
                    // 7:CALIDAD, 8:FECHA ELAB, 9:FECHAVENCI, 10:CAJA2, 11:TALLA, 12:UDS,
                    // 13:LIBRAS, 14:PROMEDIO, 15:QUEES, 16:EMPAQUE, 17:CUARTO, 18:POSICION, 19:TARIMA

                    // Debug: mostrar contenido de la fila
                    Log::info("Fila {$filaActual} datos: " . json_encode($row));

                    // Validar campos requeridos
                    if (empty($row[2])) { // LOTE es requerido
                        throw new \Exception('El campo LOTE es requerido y está vacío.');
                    }
                    if (empty($row[3])) { // CODIGO es requerido
                        throw new \Exception('El campo CODIGO es requerido y está vacío.');
                    }

                    // Convertir fechas (pueden venir como texto MM/DD/YYYY o número Excel)
                    $fechaemp = $this->parseDate($row[1] ?? null);
                    $fecha_elab = $this->parseDate($row[8] ?? null);
                    $fechavenci = $this->parseDate($row[9] ?? null);

                    Log::info("Fila {$filaActual} - Fechas parseadas: FECHAEMP={$fechaemp}, FECHA ELAB={$fecha_elab}, FECHAVENCI={$fechavenci}");

                    // Validar que las fechas requeridas no sean nulas
                    if (!$fechaemp) {
                        throw new \Exception('El campo FECHAEMP es requerido pero está vacío o tiene formato inválido. Valor original: ' . json_encode($row[1] ?? 'null'));
                    }
                    if (!$fecha_elab) {
                        throw new \Exception('El campo FECHA ELAB es requerido pero está vacío o tiene formato inválido. Valor original: ' . json_encode($row[8] ?? 'null'));
                    }
                    if (!$fechavenci) {
                        throw new \Exception('El campo FECHAVENCI es requerido pero está vacío o tiene formato inválido. Valor original: ' . json_encode($row[9] ?? 'null'));
                    }

                    // Preparar datos con valores por defecto
                    $data = [
                        'items' => is_numeric($row[0] ?? null) ? (int) $row[0] : null,
                        'fechaemp' => $fechaemp,
                        'lote' => trim($row[2]),
                        'codigo' => trim($row[3]),
                        'caja' => is_numeric($row[4] ?? 0) ? (int) $row[4] : 0,
                        'especie' => trim($row[5] ?? ''),
                        'producto' => trim($row[6] ?? ''),
                        'calidad' => trim($row[7] ?? 'A'),
                        'fecha_elab' => $fecha_elab,
                        'fechavenci' => $fechavenci,
                        'caja2' => is_numeric($row[10] ?? 0) ? (int) $row[10] : 0,
                        'talla' => trim($row[11] ?? ''),
                        'uds' => is_numeric($row[12] ?? null) ? $row[12] : null,
                        'libras' => is_numeric($row[13] ?? null) ? $row[13] : null,
                        'promedio' => is_numeric($row[14] ?? null) ? $row[14] : null,
                        'quees' => trim($row[15] ?? 'INVFISICO'),
                        'empaque' => trim($row[16] ?? 'CAJA LBS LIBRE'),
                        'cuarto' => is_numeric($row[17] ?? 1) ? (int) $row[17] : 1,
                        'posicion' => trim($row[18] ?? ''),
                        'tarima' => is_numeric($row[19] ?? 1) ? (int) $row[19] : 1,
                    ];

                    Log::info("Fila {$filaActual} - Creando registro: LOTE={$data['lote']}, CODIGO={$data['codigo']}");

                    Ingreso::create($data);
                    $ingresosCreados++;
                    Log::info("Fila {$filaActual} - Registro creado exitosamente");
                } catch (\Exception $e) {
                    $mensajeError = "Fila {$filaActual}: " . $e->getMessage();
                    Log::error($mensajeError);
                    $errores[] = $mensajeError;
                }

                $filaActual++;
            }

            Log::info("=== Fin de importación - Registros creados: {$ingresosCreados}, Errores: " . count($errores) . ' ===');

            // Si es petición AJAX, devolver JSON
            if ($request->wantsJson() || $request->ajax()) {
                if (!empty($errores)) {
                    return response()->json([
                        'success' => true,
                        'message' => "Se importaron {$ingresosCreados} registros, pero hubo " . count($errores) . " errores.",
                        'count' => $ingresosCreados,
                        'errores' => array_slice($errores, 0, 10), // Mostrar solo los primeros 10 errores
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => "Se importaron {$ingresosCreados} registros exitosamente.",
                    'count' => $ingresosCreados,
                ]);
            }

            // Si no, redirigir con mensaje flash
            if ($errores) {
                return redirect()->route('ingresos.index')
                    ->with('warning', "Se importaron {$ingresosCreados} registros, pero hubo errores en algunos: " . implode(', ', array_slice($errores, 0, 5)));
            }

            return redirect()->route('ingresos.index')
                ->with('success', "Se importaron {$ingresosCreados} registros exitosamente.");
        } catch (\Exception $e) {
            Log::error('Error general en import: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al importar el archivo: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->route('ingresos.index')
                ->with('error', 'Error al importar el archivo: ' . $e->getMessage());
        }
    }

    /**
     * Parsear fecha desde Excel (puede ser texto MM/DD/YYYY, DD/MM/YYYY o número serial)
     */
    private function parseDate($value)
    {
        if (empty($value) || $value === null) {
            return null;
        }

        // Si es objeto DateTime (PhpSpreadsheet a veces lo convierte automáticamente)
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d H:i:s');
        }

        // Si es número serial de Excel
        if (is_numeric($value) && $value > 0) {
            try {
                return Date::excelToDateTimeObject($value)->format('Y-m-d H:i:s');
            } catch (\Exception $e) {
                Log::warning("No se pudo convertir número Excel {$value}: " . $e->getMessage());
                return null;
            }
        }

        // Si es texto
        if (is_string($value)) {
            $value = trim($value);

            if (empty($value)) {
                return null;
            }

            // Intentar formato MM/DD/YYYY
            if (preg_match('/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $value, $matches)) {
                $primerNumero = (int) $matches[1];
                $segundoNumero = (int) $matches[2];
                $anio = (int) $matches[3];

                // Priorizar MM/DD/YYYY (formato americano)
                if (checkdate($primerNumero, $segundoNumero, $anio)) {
                    $mes = str_pad($primerNumero, 2, '0', STR_PAD_LEFT);
                    $dia = str_pad($segundoNumero, 2, '0', STR_PAD_LEFT);
                    $anioStr = str_pad($anio, 4, '0', STR_PAD_LEFT);
                    return "$anioStr-$mes-{$dia} 00:00:00";
                }

                // Intentar DD/MM/YYYY
                if (checkdate($segundoNumero, $primerNumero, $anio)) {
                    $mes = str_pad($segundoNumero, 2, '0', STR_PAD_LEFT);
                    $dia = str_pad($primerNumero, 2, '0', STR_PAD_LEFT);
                    $anioStr = str_pad($anio, 4, '0', STR_PAD_LEFT);
                    return "$anioStr-$mes-{$dia} 00:00:00";
                }

                Log::warning("Formato de fecha no válido: $value");
                return null;
            }

            // Intentar formato YYYY-MM-DD o YYYY-MM-DD HH:MM:SS
            if (preg_match('/^(\d{4})-(\d{1,2})-(\d{1,2})(\s+\d{1,2}:\d{1,2}(:\d{1,2})?)?$/', $value)) {
                $timestamp = strtotime($value);
                if ($timestamp) {
                    return date('Y-m-d H:i:s', $timestamp);
                }
            }

            // Intentar parsear con strtotime para otros formatos
            $timestamp = strtotime($value);
            if ($timestamp !== false) {
                return date('Y-m-d H:i:s', $timestamp);
            }

            Log::warning("No se pudo parsear la fecha: $value");
        }

        return null;
    }
}
