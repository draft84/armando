<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salida extends Model
{
    use HasFactory;

    protected $table = 'salidas';

    protected $fillable = [
        'items',
        'fecha',
        'lote',
        'codigo',
        'caja',
        'especie',
        'producto',
        'calidad',
        'fecha_elab',
        'fechavenci',
        'caja2',
        'talla',
        'uds',
        'libras',
        'promedio',
        'quees',
        'empaque',
        'cuarto',
        'posicion',
        'tarima',
        'cliente',
        'ndoc',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'fecha_elab' => 'datetime',
        'fechavenci' => 'datetime',
        'caja' => 'integer',
        'caja2' => 'integer',
        'uds' => 'integer',
        'cuarto' => 'integer',
        'tarima' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($salida) {
            // Fórmula: CAJA2 = CAJA (réplica de la fórmula del Excel)
            $salida->caja2 = $salida->caja;

            // Fórmula: PROMEDIO = LIBRAS / UDS (réplica de la fórmula del Excel)
            if ($salida->uds > 0 && $salida->libras) {
                $salida->promedio = round($salida->libras / $salida->uds, 2);
            }

            // Fórmula: CUARTO = LEN(CALIDAD) si no se proporciona
            if (!$salida->cuarto && $salida->calidad) {
                $salida->cuarto = strlen($salida->calidad);
            }
        });

        // Recalcular Resumen al crear o actualizar
        static::saved(function ($salida) {
            Resumen::syncFromSalida($salida);
        });

        // Recalcular Resumen al eliminar
        static::deleted(function ($salida) {
            Resumen::syncFromSalida($salida);
        });
    }

    /**
     * Scope para obtener el resumen por fecha más cercana
     */
    public function scopeFechaCercana($query, $fecha = null)
    {
        $fecha = $fecha ?? now();
        return $query->orderByRaw('ABS(DATEDIFF(fecha, ?))', [$fecha]);
    }

    /**
     * Obtener totales del resumen
     */
    public static function getTotales($fecha = null)
    {
        $query = self::query();

        if ($fecha) {
            $query->fechaCercana($fecha);
        }

        return [
            'total_cajas' => $query->sum('caja'),
            'total_items' => $query->count(),
            'fecha_mas_cercana' => $query->min('fecha'),
        ];
    }
}
