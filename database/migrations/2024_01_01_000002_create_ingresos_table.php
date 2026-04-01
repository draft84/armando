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
        Schema::create('ingresos', function (Blueprint $table) {
            $table->id();
            $table->integer('items')->comment('ITEMS');
            $table->dateTime('fechaemp')->comment('FECHAEMP');
            $table->string('lote')->comment('LOTE');
            $table->string('codigo')->comment('CODIGO');
            $table->integer('caja')->comment('CAJA');
            $table->string('especie')->comment('ESPECIE');
            $table->string('producto')->comment('PRODUCTO');
            $table->string('calidad')->comment('CALIDAD');
            $table->dateTime('fecha_elab')->comment('FECHA ELAB');
            $table->dateTime('fechavenci')->comment('FECHAVENCI');
            $table->integer('caja2')->comment('CAJA2 - Fórmula: =CAJA');
            $table->string('talla')->comment('TALLA');
            $table->timestamps();

            $table->index('fechaemp');
            $table->index('lote');
            $table->index('especie');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingresos');
    }
};
