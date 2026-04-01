<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Ingreso;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario administrador por defecto
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@sysf.com',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);

        // Crear datos de ejemplo basados en el Excel
        Ingreso::create([
            'items' => 2,
            'fechaemp' => '2025-12-22 00:00:00',
            'lote' => '64/25',
            'codigo' => '010903060401',
            'caja' => 4233,
            'especie' => 'ATUN',
            'producto' => 'LOMO SIN PIEL, CON CO',
            'calidad' => 'A',
            'fecha_elab' => '2025-12-17 00:00:00',
            'fechavenci' => '2026-12-17 00:00:00',
            'caja2' => 4233,
            'talla' => '58',
            'uds' => 7,
            'libras' => 47.00,
            'promedio' => 6.71,
            'quees' => 'INVFISICO',
            'empaque' => 'CAJA LBS LIBRE',
            'cuarto' => 1,
            'posicion' => null,
            'tarima' => 1,
        ]);

        // Crear más datos de ejemplo
        for ($i = 1; $i <= 50; $i++) {
            $uds = rand(5, 10);
            $libras = rand(30, 70) + round(rand(0, 100) / 100, 2);
            
            Ingreso::create([
                'items' => $i + 2,
                'fechaemp' => now()->addDays(rand(-30, 60))->format('Y-m-d') . ' 00:00:00',
                'lote' => sprintf('%02d/%02d', rand(1, 99), rand(25, 26)),
                'codigo' => sprintf('0109030604%02d', rand(1, 99)),
                'caja' => rand(1000, 10000),
                'especie' => ['ATUN', 'SARDINA', 'JUREL', 'CABALLA'][rand(0, 3)],
                'producto' => ['LOMO SIN PIEL, CON CO', 'ENTERO', 'EN ACEITE', 'AL NATURAL'][rand(0, 3)],
                'calidad' => ['A', 'B', 'C'][rand(0, 2)],
                'fecha_elab' => now()->subDays(rand(5, 15))->format('Y-m-d') . ' 00:00:00',
                'fechavenci' => now()->addDays(rand(300, 400))->format('Y-m-d') . ' 00:00:00',
                'caja2' => 0, // Se calculará automáticamente
                'talla' => ['58', '60', '65', '70', '80'][rand(0, 4)],
                'uds' => $uds,
                'libras' => $libras,
                'promedio' => 0, // Se calculará automáticamente
                'quees' => ['INVFISICO', 'INVQUIMICO', 'MUESTRA'][rand(0, 2)],
                'empaque' => ['CAJA LBS LIBRE', 'BOLSA VACIO', 'TARRINA'][rand(0, 2)],
                'cuarto' => rand(1, 5),
                'posicion' => rand(0, 1) ? null : 'A-' . rand(1, 10),
                'tarima' => rand(1, 3),
            ]);
        }
    }
}
