<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CajaInventario extends Model
{
    use HasFactory;

    protected $table = 'cajas_inventario';

    protected $fillable = [
        'caja_numero',
        'codigo_producto',
        'lote',
        'especie',
        'producto',
        'calidad',
        'talla',
        'empaque',
        'libras',
        'uds',
        'promedio',
        'fecha_elab',
        'fechavenci',
        'cuarto',
        'posicion',
        'tarima',
        'estado',
        'ingreso_id',
        'salida_id',
        'cliente',
        'ndoc',
        'observaciones',
    ];

    protected $casts = [
        'caja_numero' => 'integer',
        'libras' => 'decimal:2',
        'uds' => 'integer',
        'promedio' => 'decimal:2',
        'fecha_elab' => 'datetime',
        'fechavenci' => 'datetime',
        'cuarto' => 'integer',
        'tarima' => 'integer',
        'ingreso_id' => 'integer',
        'salida_id' => 'integer',
    ];

    /**
     * Relación con el ingreso origen
     */
    public function ingreso()
    {
        return $this->belongsTo(Ingreso::class, 'ingreso_id');
    }

    /**
     * Relación con la salida (si fue vendida)
     */
    public function salida()
    {
        return $this->belongsTo(Salida::class, 'salida_id');
    }

    /**
     * Scope: solo cajas en stock
     */
    public function scopeEnStock($query)
    {
        return $query->where('estado', 'EN_STOCK');
    }

    /**
     * Scope: filtrar por estado
     */
    public function scopeEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope: por código de producto
     */
    public function scopeCodigo($query, $codigo)
    {
        return $query->where('codigo_producto', $codigo);
    }

    /**
     * Scope: por lote
     */
    public function scopeLote($query, $lote)
    {
        return $query->where('lote', $lote);
    }

    /**
     * Scope: por especie
     */
    public function scopeEspecie($query, $especie)
    {
        return $query->where('especie', $especie);
    }

    /**
     * Totales de cajas en stock
     */
    public static function getTotalesStock()
    {
        return [
            'total_cajas' => self::enStock()->count(),
            'total_libras' => self::enStock()->sum('libras'),
            'total_uds' => self::enStock()->sum('uds'),
        ];
    }

    /**
     * Crear registros de cajas a partir de un Ingreso.
     * Usa inserción masiva para mejor rendimiento.
     */
    public static function createFromIngreso($ingreso)
    {
        $cantidadCajas = $ingreso->caja ?? 0;
        if ($cantidadCajas <= 0) return [];

        $librasPorCaja = $cantidadCajas > 0 && $ingreso->libras
            ? round($ingreso->libras / $cantidadCajas, 2)
            : $ingreso->libras;

        $udsPorCaja = $cantidadCajas > 0 && $ingreso->uds
            ? round($ingreso->uds / $cantidadCajas)
            : $ingreso->uds;

        $now = now();
        $batch = [];
        for ($i = 0; $i < $cantidadCajas; $i++) {
            $batch[] = [
                'caja_numero' => $i + 1, // Temporal, se corrige después
                'codigo_producto' => $ingreso->codigo,
                'lote' => $ingreso->lote,
                'especie' => $ingreso->especie,
                'producto' => $ingreso->producto,
                'calidad' => $ingreso->calidad,
                'talla' => $ingreso->talla,
                'empaque' => $ingreso->empaque,
                'libras' => $librasPorCaja,
                'uds' => $udsPorCaja,
                'promedio' => $ingreso->promedio,
                'fecha_elab' => $ingreso->fecha_elab,
                'fechavenci' => $ingreso->fechavenci,
                'cuarto' => $ingreso->cuarto,
                'posicion' => $ingreso->posicion,
                'tarima' => $ingreso->tarima,
                'estado' => 'EN_STOCK',
                'ingreso_id' => $ingreso->id,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (!empty($batch)) {
            // MySQL tiene un límite de 65535 placeholders por query
            // Usar chunks pequeños (100 = 2000 placeholders)
            $chunks = array_chunk($batch, 100);
            $runningOffset = self::max('caja_numero') ?? 0;
            foreach ($chunks as $chunkIdx => $chunk) {
                foreach ($chunk as $idx => &$item) {
                    $item['caja_numero'] = $runningOffset + ($chunkIdx * 100) + $idx + 1;
                }
                unset($item);
                self::insert($chunk);
                // Refresh offset after each chunk insert
                $runningOffset += count($chunk);
            }
        }

        return $batch;
    }

    /**
     * Marcar cajas como vendidas/usadas a partir de una Salida.
     * Usa update masivo para mejor rendimiento.
     */
    public static function markBoxesAsSolded($salida)
    {
        $cantidadCajas = $salida->caja ?? 0;
        if ($cantidadCajas <= 0) return;

        // Obtener IDs de cajas a actualizar
        $ids = self::where('codigo_producto', $salida->codigo)
            ->where('estado', 'EN_STOCK')
            ->orderBy('fecha_elab', 'asc')
            ->limit($cantidadCajas)
            ->pluck('id');

        if ($ids->isEmpty()) return;

        self::whereIn('id', $ids)->update([
            'estado' => 'VENDIDA',
            'salida_id' => $salida->id,
            'cliente' => $salida->cliente,
            'ndoc' => $salida->ndoc,
        ]);
    }
}
