<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingreso extends Model
{
    use HasFactory;

    protected $table = 'ingresos';

    protected $fillable = [
        'items',
        'fechaemp',
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
    ];

    protected $casts = [
        'fechaemp' => 'datetime',
        'fecha_elab' => 'datetime',
        'fechavenci' => 'datetime',
        'caja' => 'integer',
        'caja2' => 'integer',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($ingreso) {
            // Fórmula: CAJA2 = CAJA (réplica de la fórmula del Excel)
            $ingreso->caja2 = $ingreso->caja;
            
            // Fórmula: PROMEDIO = LIBRAS / UDS (réplica de la fórmula del Excel)
            if ($ingreso->uds > 0 && $ingreso->libras) {
                $ingreso->promedio = round($ingreso->libras / $ingreso->uds, 2);
            }
        });
    }

    /**
     * Scope para obtener el resumen por fecha más cercana
     */
    public function scopeFechaCercana($query, $fecha = null)
    {
        $fecha = $fecha ?? now();
        return $query->orderByRaw('ABS(DATEDIFF(fechaemp, ?))', [$fecha]);
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
            'fecha_mas_cercana' => $query->min('fechaemp'),
        ];
    }
}
