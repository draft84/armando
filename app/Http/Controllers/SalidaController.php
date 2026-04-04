<?php

namespace App\Http\Controllers;

use App\Models\Salida;
use App\Models\Resumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class SalidaController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Salidas/Create');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 5);
        $search = $request->get('search', '');

        $query = Salida::query();

        // Búsqueda en tiempo real
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('lote', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('especie', 'like', "%{$search}%")
                    ->orWhere('producto', 'like', "%{$search}%")
                    ->orWhere('calidad', 'like', "%{$search}%")
                    ->orWhere('talla', 'like', "%{$search}%")
                    ->orWhere('cliente', 'like', "%{$search}%")
                    ->orWhere('ndoc', 'like', "%{$search}%");
            });
        }

        $salidas = $query->orderBy('fecha', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Totales del resumen
        $totales = Salida::getTotales();

        return Inertia::render('Salidas/Index', [
            'salidas' => $salidas,
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
            'fecha' => 'required|date',
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
            'cliente' => 'nullable|string|max:255',
            'ndoc' => 'nullable|string|max:255',
        ]);

        Salida::create($validated);

        return redirect()->route('salidas.index')
            ->with('success', 'Salida creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Salida $salida)
    {
        return Inertia::render('Salidas/Show', [
            'salida' => $salida,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Salida $salida)
    {
        return Inertia::render('Salidas/Edit', [
            'salida' => $salida,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Salida $salida)
    {
        $validated = $request->validate([
            'items' => 'required|integer',
            'fecha' => 'required|date',
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
            'cliente' => 'nullable|string|max:255',
            'ndoc' => 'nullable|string|max:255',
        ]);

        $salida->update($validated);

        return redirect()->route('salidas.index')
            ->with('success', 'Salida actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Salida $salida)
    {
        $salida->delete();

        return redirect()->route('salidas.index')
            ->with('success', 'Salida eliminada exitosamente.');
    }

    /**
     * Importar desde Excel (optimizado para archivos grandes)
     */
    public function import(Request $request)
    {
        Log::info('=== Inicio de importación de Salidas ===');

        if (!$request->hasFile('file')) {
            Log::error('No se recibió ningún archivo en la petición');
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

            // Leer valores crudos directamente del XML del xlsx para evitar
            // errores con fórmulas de tabla estructurada
            $rawData = $this->readRawXlsxValues($file->getRealPath());
            
            if (empty($rawData)) {
                throw new \Exception('El archivo Excel está vacío o no se pudo leer.');
            }

            $totalRows = count($rawData);
            Log::info("Filas leídas: {$totalRows}");

            $salidasCreadas = 0;
            $errores = [];

            // Saltar fila 0 (encabezados), empezar en índice 1
            for ($i = 1; $i < $totalRows; $i++) {
                $rowData = $rawData[$i];

                // Saltar filas vacías
                if (empty(array_filter($rowData, function($cell) { return $cell !== null && $cell !== ''; }))) {
                    continue;
                }

                try {
                    // Estructura del Excel para Salidas:
                    // 0:ITEMS, 1:FECHA, 2:LOTE, 3:CODIGO, 4:CAJA, 5:ESPECIE, 6:PRODUCTO,
                    // 7:CALIDAD, 8:FECHA ELAB, 9:FECHAVENCI, 10:CAJA2, 11:TALLA, 12:UDS,
                    // 13:LIBRAS, 14:PROMEDIO, 15:QUEES, 16:EMPAQUE, 17:CUARTO, 18:POSICION,
                    // 19:TARIMA, 20:CLIENTE, 21:N°DOC

                    if (empty($rowData[2])) {
                        throw new \Exception('El campo LOTE es requerido y está vacío.');
                    }
                    if (empty($rowData[3])) {
                        throw new \Exception('El campo CODIGO es requerido y está vacío.');
                    }

                    $fecha = $this->parseDate($rowData[1] ?? null);
                    $fecha_elab = $this->parseDate($rowData[8] ?? null);
                    $fechavenci = $this->parseDate($rowData[9] ?? null);

                    if (!$fecha) {
                        throw new \Exception('El campo FECHA es requerido pero está vacío o tiene formato inválido.');
                    }
                    if (!$fecha_elab) {
                        throw new \Exception('El campo FECHA ELAB es requerido pero está vacío o tiene formato inválido.');
                    }
                    if (!$fechavenci) {
                        throw new \Exception('El campo FECHAVENCI es requerido pero está vacío o tiene formato inválido.');
                    }

                    $data = [
                        'items' => is_numeric($rowData[0] ?? null) ? (int) $rowData[0] : null,
                        'fecha' => $fecha,
                        'lote' => trim($rowData[2]),
                        'codigo' => trim($rowData[3]),
                        'caja' => is_numeric($rowData[4] ?? 0) ? (int) $rowData[4] : 0,
                        'especie' => trim($rowData[5] ?? ''),
                        'producto' => trim($rowData[6] ?? ''),
                        'calidad' => trim($rowData[7] ?? 'A'),
                        'fecha_elab' => $fecha_elab,
                        'fechavenci' => $fechavenci,
                        'caja2' => is_numeric($rowData[10] ?? 0) ? (int) $rowData[10] : 0,
                        'talla' => trim($rowData[11] ?? ''),
                        'uds' => is_numeric($rowData[12] ?? null) ? $rowData[12] : null,
                        'libras' => is_numeric($rowData[13] ?? null) ? $rowData[13] : null,
                        'promedio' => is_numeric($rowData[14] ?? null) ? $rowData[14] : null,
                        'quees' => trim($rowData[15] ?? 'INVFISICO'),
                        'empaque' => trim($rowData[16] ?? 'CAJA LBS LIBRE'),
                        'cuarto' => is_numeric($rowData[17] ?? null) ? (int) $rowData[17] : null,
                        'posicion' => trim($rowData[18] ?? ''),
                        'tarima' => is_numeric($rowData[19] ?? null) ? (int) $rowData[19] : null,
                        'cliente' => trim($rowData[20] ?? ''),
                        'ndoc' => trim($rowData[21] ?? ''),
                    ];

                    Salida::create($data);
                    $salidasCreadas++;
                } catch (\Exception $e) {
                    $errores[] = "Fila {$i}: " . $e->getMessage();
                }

                // Liberar memoria cada 100 filas
                if ($i % 100 === 0) {
                    gc_collect_cycles();
                }
            }

            gc_collect_cycles();

            Log::info("=== Fin de importación - Registros creados: {$salidasCreadas}, Errores: " . count($errores) . ' ===');

            // Sincronizar resumen automáticamente después de importar
            Resumen::syncAll();
            Log::info('Resumen sincronizado después de importación');

            if ($request->wantsJson() || $request->ajax()) {
                if (!empty($errores)) {
                    return response()->json([
                        'success' => true,
                        'message' => "Se importaron {$salidasCreadas} registros, pero hubo " . count($errores) . " errores.",
                        'count' => $salidasCreadas,
                        'errores' => array_slice($errores, 0, 10),
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => "Se importaron {$salidasCreadas} registros exitosamente.",
                    'count' => $salidasCreadas,
                ]);
            }

            if ($errores) {
                return redirect()->route('salidas.index')
                    ->with('warning', "Se importaron {$salidasCreadas} registros, pero hubo errores en algunos: " . implode(', ', array_slice($errores, 0, 5)));
            }

            return redirect()->route('salidas.index')
                ->with('success', "Se importaron {$salidasCreadas} registros exitosamente.");
        } catch (\Exception $e) {
            Log::error('Error general en import: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al importar el archivo: ' . $e->getMessage(),
                ], 500);
            }

            return redirect()->route('salidas.index')
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

        // Si es objeto DateTime
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

    /**
     * Lee valores crudos de un archivo xlsx directamente del XML,
     * sin intentar evaluar fórmulas. Esto evita errores con
     * fórmulas de tabla estructurada (=Tabla1[[#This Row],[...]])
     */
    private function readRawXlsxValues($filePath): array
    {
        $zip = new \ZipArchive();
        if ($zip->open($filePath) !== true) {
            throw new \Exception('No se pudo abrir el archivo xlsx.');
        }

        // Leer shared strings (valores de texto compartidos)
        $sharedStrings = [];
        $ssXml = $zip->getFromName('xl/sharedStrings.xml');
        if ($ssXml !== false) {
            $ssXml = simplexml_load_string($ssXml);
            if ($ssXml) {
                foreach ($ssXml->si as $si) {
                    $t = '';
                    foreach ($si->t as $tNode) {
                        $t .= (string) $tNode;
                    }
                    if ($t === '' && isset($si->r)) {
                        foreach ($si->r as $r) {
                            $t .= (string) $r->t;
                        }
                    }
                    $sharedStrings[] = $t;
                }
            }
        }

        // Leer la primera hoja
        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        $zip->close();

        if ($sheetXml === false) {
            throw new \Exception('No se encontró la hoja de cálculo.');
        }

        $xml = simplexml_load_string($sheetXml);
        if (!$xml) {
            throw new \Exception('No se pudo parsear el XML de la hoja.');
        }

        // Parsear dimensiones
        $dimension = (string) ($xml->dimension['ref'] ?? '');
        $highestRow = 0;
        if (preg_match('/\d+$/', $dimension, $matches)) {
            $highestRow = (int) $matches[0];
        }

        // Construir mapa de columnas
        $colMap = [];
        if (isset($xml->sheetData->row)) {
            foreach ($xml->sheetData->row as $row) {
                $rowIndex = (int) $row['r'];
                foreach ($row->c as $cell) {
                    $cellRef = (string) $cell['r'];
                    preg_match('/^([A-Z]+)/', $cellRef, $colMatch);
                    $colLetter = $colMatch[1] ?? '';
                    $colNum = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($colLetter);
                    
                    $value = null;
                    $cellType = (string) ($cell['t'] ?? '');
                    $hasFormula = isset($cell->f);
                    
                    if ($hasFormula) {
                        // Celda con fórmula: leer el valor almacenado en <v>, NO evaluar
                        if (isset($cell->v)) {
                            $v = (string) $cell->v;
                            if ($cellType === 's') {
                                $value = $sharedStrings[(int) $v] ?? $v;
                            } else {
                                $value = is_numeric($v) ? (strpos($v, '.') !== false ? (float) $v : (int) $v) : $v;
                            }
                        }
                        // Si no hay <v> (valor cacheado), value queda null
                    } elseif ($cellType === 's') {
                        // Shared string
                        $idx = (int) $cell->v;
                        $value = $sharedStrings[$idx] ?? null;
                    } elseif ($cellType === 'inlineStr') {
                        // Inline string
                        $value = (string) ($cell->is->t ?? '');
                    } elseif ($cellType === 'b') {
                        // Boolean
                        $value = (string) ($cell->v ?? '0') === '1';
                    } elseif ($cellType === 'str') {
                        // String result (from formula)
                        $value = (string) ($cell->v ?? '');
                    } elseif ($cellType === 'd') {
                        // Date
                        $value = (string) ($cell->v ?? '');
                    } elseif ($cellType === 'n' || $cellType === '') {
                        // Number or default
                        if (isset($cell->v)) {
                            $v = (string) $cell->v;
                            $value = is_numeric($v) ? (strpos($v, '.') !== false ? (float) $v : (int) $v) : $v;
                        }
                    } else {
                        // Fallback: cualquier otro tipo
                        if (isset($cell->v)) {
                            $value = (string) $cell->v;
                        }
                    }
                    
                    if (!isset($colMap[$rowIndex])) {
                        $colMap[$rowIndex] = [];
                    }
                    $colMap[$rowIndex][$colNum] = $value;
                }
            }
        }

        // Convertir a array numerado continuo
        $result = [];
        // Encontrar el máximo de columnas
        $maxCols = 22; // Mínimo 22 columnas para Salidas
        foreach ($colMap as $cols) {
            $maxCols = max($maxCols, max(array_keys($cols)));
        }
        
        for ($r = 1; $r <= $highestRow; $r++) {
            $rowData = [];
            $rowCols = $colMap[$r] ?? [];
            for ($c = 1; $c <= $maxCols; $c++) {
                $rowData[] = $rowCols[$c] ?? null;
            }
            $result[] = $rowData;
        }

        return $result;
    }
}
