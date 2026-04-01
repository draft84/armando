<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\ValidateSignature as Middleware;

class ValidateSignature extends Middleware
{
    /**
     * Indicates whether the signature should be ignored for the given route.
     *
     * @return bool
     */
    protected function shouldIgnore($route)
    {
        return in_array($route, [
            //
        ]);
    }
}
