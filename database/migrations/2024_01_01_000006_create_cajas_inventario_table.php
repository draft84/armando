<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Tabla para rastrear cada caja individualmente.
     * Cada caja tiene un número único e irrepetible.
     * Permite saber exactamente qué cajas componen el inventario actual.
     */
    public function up(): void
    {
        Schema::create('cajas_inventario', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('caja_numero')->comment('Número de caja (único por producto)');
            $table->string('codigo_producto', 50)->comment('Código del producto');
            $table->string('lote', 50)->comment('Número de lote');
            $table->string('especie', 100)->comment('Tipo de pescado');
            $table->string('producto', 255)->comment('Descripción del corte');
            $table->string('calidad', 20)->comment('Clasificación de calidad');
            $table->string('talla', 20)->nullable()->comment('Tamaño del producto');
            $table->string('empaque', 100)->nullable()->comment('Tipo de empaque');
            $table->decimal('libras', 10, 2)->nullable()->comment('Peso en libras');
            $table->integer('uds')->nullable()->comment('Unidades/piezas');
            $table->decimal('promedio', 10, 2)->nullable()->comment('Libras/UDS');
            $table->dateTime('fecha_elab')->comment('Fecha elaboración');
            $table->dateTime('fechavenci')->comment('Fecha vencimiento');
            $table->integer('cuarto')->nullable()->comment('Cuarto de almacenamiento');
            $table->string('posicion', 50)->nullable()->comment('Posición en el cuarto');
            $table->integer('tarima')->nullable()->comment('Tarima/pallet');
            $table->string('estado', 20)->default('EN_STOCK')->comment('EN_STOCK, VENDIDA, USADA, MERMA, MUESTRA');
            $table->unsignedBigInteger('ingreso_id')->nullable()->comment('ID del ingreso que creó esta caja');
            $table->unsignedBigInteger('salida_id')->nullable()->comment('ID de la salida que retiró esta caja');
            $table->string('cliente', 255)->nullable()->comment('Cliente al que se vendió');
            $table->string('ndoc', 100)->nullable()->comment('N° documento de salida');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            // Índices para búsquedas frecuentes
            $table->index('estado');
            $table->index('codigo_producto');
            $table->index('lote');
            $table->index('especie');
            $table->index('caja_numero');
            $table->index('ingreso_id');
            $table->index('salida_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cajas_inventario');
    }
};
