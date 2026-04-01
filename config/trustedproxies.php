<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Trusted Proxies
    |--------------------------------------------------------------------------
    */

    'proxies' => null,

    /*
    |--------------------------------------------------------------------------
    | Trusted Headers
    |--------------------------------------------------------------------------
    */

    'headers' => [
        // \Illuminate\Http\Request::HEADER_FORWARDED => 'forwarded',
        \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR => 'x_forwarded_for',
        \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST => 'x_forwarded_host',
        \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT => 'x_forwarded_port',
        \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO => 'x_forwarded_proto',
        \Illuminate\Http\Request::HEADER_X_FORWARDED_AWS_ELB => 'x_forwarded_aws_elb',
    ],

];
