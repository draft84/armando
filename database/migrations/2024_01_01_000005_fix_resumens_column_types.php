<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Corrige los tipos de datos de ingresos, salidas y stock de integer a decimal.
     */
    public function up(): void
    {
        Schema::table('resumens', function (Blueprint $table) {
            $table->decimal('ingresos', 12, 2)->default(0)->change();
            $table->decimal('salidas', 12, 2)->default(0)->change();
            $table->decimal('stock', 12, 2)->default(0)->change();
            $table->string('lb')->default('LB')->change();
            $table->integer('item')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resumens', function (Blueprint $table) {
            $table->integer('ingresos')->default(0)->change();
            $table->integer('salidas')->default(0)->change();
            $table->integer('stock')->default(0)->change();
            $table->decimal('lb', 10, 2)->nullable()->change();
            $table->integer('item')->change();
        });
    }
};
