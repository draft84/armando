<?php

namespace App\Console\Commands;

use App\Models\Resumen;
use Illuminate\Console\Command;

class SyncResumen extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'resumen:sync {--all : Sincronizar todos los registros}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza automáticamente el resumen (STOCK = INGRESOS - SALIDAS)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Sincronizando resumen...');

        $this->info('📊 Contando registros...');
        $totalIngresos = \App\Models\Ingreso::count();
        $totalSalidas = \App\Models\Salida::count();
        $this->line("   Ingresos: {$totalIngresos} registros");
        $this->line("   Salidas: {$totalSalidas} registros");

        $this->info('⚡ Calculando stock por código de producto...');
        Resumen::syncAll();

        $totalResumen = Resumen::count();
        $totalStock = Resumen::sum('stock');

        $this->info("✅ Resumen sincronizado exitosamente!");
        $this->line("   Productos en resumen: {$totalResumen}");
        $this->line("   Stock total: {$totalStock} LB");

        return Command::SUCCESS;
    }
}
