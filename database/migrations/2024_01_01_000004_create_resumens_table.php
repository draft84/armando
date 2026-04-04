<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('resumens', function (Blueprint $table) {
            $table->id();
            $table->integer('item')->nullable()->comment('ITEM');
            $table->string('codigo')->unique()->comment('CODIGO');
            $table->string('especie')->comment('ESPECIE');
            $table->string('producto')->comment('PRODUCTO');
            $table->string('calidad')->comment('CALIDAD');
            $table->string('estado')->default('IQF')->comment('ESTADO');
            $table->string('talla')->comment('TALLA');
            $table->string('empaque')->comment('EMPAQUE');
            $table->decimal('ingresos', 12, 2)->default(0)->comment('INGRESOS - Total libras ingresadas (SUMIFS)');
            $table->decimal('salidas', 12, 2)->default(0)->comment('SALIDAS - Total libras salidas (SUMIFS)');
            $table->decimal('stock', 12, 2)->default(0)->comment('STOCK - Fórmula: INGRESOS - SALIDAS');
            $table->string('lb')->default('LB')->comment('Unidad de medida');
            $table->text('observacion_organoleptica')->nullable()->comment('Observacion organoleptica Actual');
            $table->timestamps();

            $table->index('codigo');
            $table->index('especie');
            $table->index('calidad');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resumens');
    }
};
