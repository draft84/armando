<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resumen extends Model
{
    use HasFactory;

    protected $table = 'resumens';

    protected $fillable = [
        'item',
        'codigo',
        'especie',
        'producto',
        'calidad',
        'estado',
        'talla',
        'empaque',
        'ingresos',
        'salidas',
        'stock',
        'lb',
        'observacion_organoleptica',
    ];

    protected $casts = [
        'ingresos' => 'decimal:2',
        'salidas' => 'decimal:2',
        'stock' => 'decimal:2',
        'lb' => 'string',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($resumen) {
            // Fórmula: STOCK = INGRESOS - SALIDAS (réplica de la fórmula del Excel)
            $ingresos = floatval($resumen->ingresos ?? 0);
            $salidas = floatval($resumen->salidas ?? 0);
            $resumen->stock = round($ingresos - $salidas, 2);
        });
    }

    /**
     * Calcular totales del resumen
     */
    public static function getTotales()
    {
        return [
            'total_registros' => self::count(),
            'total_ingresos' => self::sum('ingresos'),
            'total_salidas' => self::sum('salidas'),
            'total_stock' => self::sum('stock'),
        ];
    }

    /**
     * Sinc automática del Resumen basada en todos los Ingresos.
     * Suma todas las LIBRAS de ingresos agrupadas por CODIGO.
     */
    public static function syncFromIngreso($ingreso = null)
    {
        // Si se pasó un ingreso específico, sincronizamos solo ese código
        $codigos = $ingreso
            ? collect([$ingreso->codigo])
            : Ingreso::distinct()->pluck('codigo');

        foreach ($codigos as $codigo) {
            $totalIngresos = Ingreso::where('codigo', $codigo)->sum('libras') ?? 0;
            $totalSalidas = Salida::where('codigo', $codigo)->sum('libras') ?? 0;

            self::updateOrCreate(
                ['codigo' => $codigo],
                [
                    'especie' => Ingreso::where('codigo', $codigo)->value('especie') ?? '',
                    'producto' => Ingreso::where('codigo', $codigo)->value('producto') ?? '',
                    'calidad' => Ingreso::where('codigo', $codigo)->value('calidad') ?? '',
                    'talla' => Ingreso::where('codigo', $codigo)->value('talla') ?? '',
                    'empaque' => Ingreso::where('codigo', $codigo)->value('empaque') ?? '',
                    'estado' => 'IQF',
                    'ingresos' => $totalIngresos,
                    'salidas' => $totalSalidas,
                    'lb' => 'LB',
                    // STOCK se calcula automáticamente: INGRESOS - SALIDAS
                ]
            );
        }
    }

    /**
     * Sinc automática del Resumen basada en todas las Salidas.
     * Suma todas las LIBRAS de salidas agrupadas por CODIGO.
     */
    public static function syncFromSalida($salida = null)
    {
        // Si se pasó una salida específica, sincronizamos solo ese código
        $codigos = $salida
            ? collect([$salida->codigo])
            : Salida::distinct()->pluck('codigo');

        foreach ($codigos as $codigo) {
            $totalIngresos = Ingreso::where('codigo', $codigo)->sum('libras') ?? 0;
            $totalSalidas = Salida::where('codigo', $codigo)->sum('libras') ?? 0;

            // Obtener datos del ingreso para crear el registro si no existe
            $ingresoData = Ingreso::where('codigo', $codigo)->first();

            if ($ingresoData || self::where('codigo', $codigo)->exists()) {
                self::updateOrCreate(
                    ['codigo' => $codigo],
                    [
                        'especie' => $ingresoData->especie ?? self::where('codigo', $codigo)->value('especie') ?? '',
                        'producto' => $ingresoData->producto ?? self::where('codigo', $codigo)->value('producto') ?? '',
                        'calidad' => $ingresoData->calidad ?? self::where('codigo', $codigo)->value('calidad') ?? '',
                        'talla' => $ingresoData->talla ?? self::where('codigo', $codigo)->value('talla') ?? '',
                        'empaque' => $ingresoData->empaque ?? self::where('codigo', $codigo)->value('empaque') ?? '',
                        'estado' => 'IQF',
                        'ingresos' => $totalIngresos,
                        'salidas' => $totalSalidas,
                        'lb' => 'LB',
                        // STOCK se calcula automáticamente: INGRESOS - SALIDAS
                    ]
                );
            }
        }
    }

    /**
     * Sinc completa: recalcula TODO el resumen desde cero.
     * Útil para importaciones masivas o reparación de datos.
     */
    public static function syncAll()
    {
        // Obtener todos los códigos únicos de ingresos y salidas
        $codigosIngresos = Ingreso::distinct()->pluck('codigo');
        $codigosSalidas = Salida::distinct()->pluck('codigo');
        $todosCodigos = $codigosIngresos->merge($codigosSalidas)->unique();

        foreach ($todosCodigos as $codigo) {
            $totalIngresos = Ingreso::where('codigo', $codigo)->sum('libras') ?? 0;
            $totalSalidas = Salida::where('codigo', $codigo)->sum('libras') ?? 0;

            $ingresoData = Ingreso::where('codigo', $codigo)->first();

            if ($totalIngresos > 0 || $totalSalidas > 0) {
                self::updateOrCreate(
                    ['codigo' => $codigo],
                    [
                        'especie' => $ingresoData->especie ?? self::where('codigo', $codigo)->value('especie') ?? '',
                        'producto' => $ingresoData->producto ?? self::where('codigo', $codigo)->value('producto') ?? '',
                        'calidad' => $ingresoData->calidad ?? self::where('codigo', $codigo)->value('calidad') ?? '',
                        'talla' => $ingresoData->talla ?? self::where('codigo', $codigo)->value('talla') ?? '',
                        'empaque' => $ingresoData->empaque ?? self::where('codigo', $codigo)->value('empaque') ?? '',
                        'estado' => 'IQF',
                        'ingresos' => $totalIngresos,
                        'salidas' => $totalSalidas,
                        'lb' => 'LB',
                    ]
                );
            }
        }
    }
}
