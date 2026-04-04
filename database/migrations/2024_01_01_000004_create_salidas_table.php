<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('salidas', function (Blueprint $table) {
            $table->id();
            $table->integer('items')->nullable();
            $table->dateTime('fecha');
            $table->string('lote');
            $table->string('codigo');
            $table->integer('caja');
            $table->string('especie');
            $table->string('producto');
            $table->string('calidad');
            $table->dateTime('fecha_elab');
            $table->dateTime('fechavenci');
            $table->integer('caja2');
            $table->string('talla');
            $table->integer('uds')->nullable();
            $table->decimal('libras', 10, 2)->nullable();
            $table->decimal('promedio', 10, 2)->nullable();
            $table->string('quees')->nullable();
            $table->string('empaque')->nullable();
            $table->integer('cuarto')->nullable();
            $table->string('posicion')->nullable();
            $table->integer('tarima')->nullable();
            $table->string('cliente')->nullable();
            $table->string('ndoc')->nullable();
            $table->timestamps();

            $table->index('fecha');
            $table->index('lote');
            $table->index('cliente');
            $table->index('especie');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('salidas');
    }
};
