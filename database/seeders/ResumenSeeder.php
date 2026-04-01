<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resumen;

class ResumenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Resumen::create([
            'item' => 1,
            'codigo' => '010102011303',
            'especie' => 'ATUN',
            'producto' => 'ENTERO SIN VISCERAS, SIN AGALLAS',
            'calidad' => 'INDUSTRIAL',
            'estado' => 'IQF',
            'talla' => '20/30',
            'empaque' => 'GRANEL',
            'ingresos' => 1500,
            'salidas' => 800,
            'stock' => 700,
            'lb' => 45.5,
            'observacion_organoleptica' => 'Producto en buen estado',
        ]);

        // Crear más datos de ejemplo
        $productos = [
            ['codigo' => '010102011304', 'especie' => 'ATUN', 'producto' => 'LOMO SIN PIEL', 'calidad' => 'A', 'talla' => '58', 'empaque' => 'CAJA'],
            ['codigo' => '010102011305', 'especie' => 'SARDINA', 'producto' => 'ENTERO', 'calidad' => 'B', 'talla' => '60', 'empaque' => 'LATA'],
            ['codigo' => '010102011306', 'especie' => 'JUREL', 'producto' => 'FILETE', 'calidad' => 'A', 'talla' => '65', 'empaque' => 'BOLSA'],
            ['codigo' => '010102011307', 'especie' => 'CABALLA', 'producto' => 'AHUMADO', 'calidad' => 'A', 'talla' => '70', 'empaque' => 'VACIO'],
            ['codigo' => '010102011308', 'especie' => 'ATUN', 'producto' => 'RABO', 'calidad' => 'C', 'talla' => '80', 'empaque' => 'GRANEL'],
        ];

        foreach ($productos as $index => $producto) {
            $ingresos = rand(500, 2000);
            $salidas = rand(100, $ingresos);
            
            Resumen::create([
                'item' => $index + 2,
                'codigo' => $producto['codigo'],
                'especie' => $producto['especie'],
                'producto' => $producto['producto'],
                'calidad' => $producto['calidad'],
                'estado' => 'IQF',
                'talla' => $producto['talla'],
                'empaque' => $producto['empaque'],
                'ingresos' => $ingresos,
                'salidas' => $salidas,
                'stock' => $ingresos - $salidas,
                'lb' => round(rand(30, 60) + rand(0, 99) / 100, 2),
                'observacion_organoleptica' => ['Apto consumo', 'Revisar fecha', 'Optimo'][rand(0, 2)],
            ]);
        }
    }
}
