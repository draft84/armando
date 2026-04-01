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
        'ingresos' => 'integer',
        'salidas' => 'integer',
        'stock' => 'integer',
        'lb' => 'decimal:2',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($resumen) {
            // Fórmula: STOCK = INGRESOS - SALIDAS
            $resumen->stock = ($resumen->ingresos ?? 0) - ($resumen->salidas ?? 0);
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
}
