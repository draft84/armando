<?php

namespace App\Console\Commands;

use App\Models\CajaInventario;
use App\Models\Ingreso;
use App\Models\Salida;
use Illuminate\Console\Command;

class InventarioSync extends Command
{
    protected $signature = 'inventario:sync';
    protected $description = 'Reconstruye la tabla cajas_inventario desde cero usando Ingresos y Salidas';

    public function handle()
    {
        $this->info('🔄 Reconstruyendo inventario de cajas...');

        // Limpiar tabla
        $this->warn('⚠️ Eliminando registros existentes...');
        CajaInventario::truncate();

        $this->info('📦 Procesando Ingresos...');
        $ingresos = Ingreso::orderBy('id')->get();
        $totalCajasCreadas = 0;

        $bar = $this->output->createProgressBar($ingresos->count());
        $bar->start();

        foreach ($ingresos as $ingreso) {
            if ($ingreso->caja > 0) {
                CajaInventario::createFromIngreso($ingreso);
                $totalCajasCreadas += $ingreso->caja;
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->line("   ✅ {$totalCajasCreadas} cajas creadas desde Ingresos");

        // Ahora procesar Salidas para marcar cajas vendidas
        $this->info('📤 Procesando Salidas...');
        $salidas = Salida::orderBy('id')->get();
        $totalCajasVendidas = 0;

        $bar2 = $this->output->createProgressBar($salidas->count());
        $bar2->start();

        foreach ($salidas as $salida) {
            if ($salida->caja > 0) {
                CajaInventario::markBoxesAsSolded($salida);
                $vendidas = CajaInventario::where('salida_id', $salida->id)->count();
                $totalCajasVendidas += $vendidas;
            }
            $bar2->advance();
        }

        $bar2->finish();
        $this->newLine();
        $this->line("   ✅ {$totalCajasVendidas} cajas marcadas como vendidas");

        // Resumen final
        $enStock = CajaInventario::where('estado', 'EN_STOCK')->count();
        $vendidas = CajaInventario::where('estado', 'VENDIDA')->count();
        $librasStock = CajaInventario::where('estado', 'EN_STOCK')->sum('libras');

        $this->newLine();
        $this->info('📊 Resumen final:');
        $this->line("   Cajas en stock: {$enStock}");
        $this->line("   Cajas vendidas: {$vendidas}");
        $this->line("   Libras en stock: {$librasStock}");

        return Command::SUCCESS;
    }
}
