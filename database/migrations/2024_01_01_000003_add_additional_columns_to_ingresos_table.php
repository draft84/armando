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
        Schema::table('ingresos', function (Blueprint $table) {
            $table->integer('uds')->nullable()->comment('UDS - Unidades')->after('talla');
            $table->decimal('libras', 10, 2)->nullable()->comment('LIBRAS')->after('uds');
            $table->decimal('promedio', 10, 2)->nullable()->comment('PROMEDIO - Fórmula: =LIBRAS/UDS')->after('libras');
            $table->string('quees')->nullable()->comment('QUEES')->after('promedio');
            $table->string('empaque')->nullable()->comment('EMPAQUE')->after('quees');
            $table->integer('cuarto')->nullable()->comment('CUARTO')->after('empaque');
            $table->string('posicion')->nullable()->comment('POSICION')->after('cuarto');
            $table->integer('tarima')->nullable()->comment('TARIMA')->after('posicion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingresos', function (Blueprint $table) {
            $table->dropColumn(['uds', 'libras', 'promedio', 'quees', 'empaque', 'cuarto', 'posicion', 'tarima']);
        });
    }
};
