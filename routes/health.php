<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/

Route::get('/up', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});
