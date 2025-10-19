<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    $path = public_path('index.html');
    return response(file_get_contents($path), 200)->header('Content-Type', 'text/html');
})->where('any', '.*');
