<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\ContactController as NewContactController;
use App\Http\Controllers\API\ContactDetailController;
use App\Http\Controllers\API\TypeEventController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\OperationalCenterController;
use App\Http\Controllers\API\OperationalSupportHomeController;
use App\Http\Controllers\API\ProvinceController;
use App\Http\Controllers\API\CityController;
use App\Http\Controllers\API\TownController;
use App\Http\Controllers\API\VillageController;
use App\Http\Controllers\API\EventController;

Route::get('/events', [EventController::class, 'index']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource('contacts', ContactController::class);

// New Contact routes for incident form submission
Route::post('/incident-contacts', [NewContactController::class, 'store']);
Route::get('/incident-contacts/{id}', [NewContactController::class, 'show']);
Route::patch('/incident-contacts/{id}/status', [NewContactController::class, 'updateStatus']);
Route::apiResource('contact-details', ContactDetailController::class);

// Type Events API
Route::get('/type-events/tree', [TypeEventController::class, 'tree']);
Route::get('/type-events', [TypeEventController::class, 'index']);
Route::get('/type-events/{id}/subcategories', [TypeEventController::class, 'subcategories']);

// Location API - Hierarchical structure: Province -> City -> Town/Village
// Main location endpoints
Route::get('/locations/hierarchy', [LocationController::class, 'hierarchy']);
Route::get('/locations/search', [LocationController::class, 'search']);
Route::get('/locations/statistics', [LocationController::class, 'statistics']);
Route::get('/locations/breadcrumb', [LocationController::class, 'breadcrumb']);
Route::get('/locations/provinces/{id}/hierarchy', [LocationController::class, 'provinceHierarchy']);
Route::get('/locations/cities/{id}/hierarchy', [LocationController::class, 'cityHierarchy']);

// Province API
Route::apiResource('provinces', ProvinceController::class);
Route::get('/provinces/{id}/cities', [ProvinceController::class, 'cities']);
Route::get('/provinces/{id}/hierarchy', [ProvinceController::class, 'hierarchy']);

// City API
Route::apiResource('cities', CityController::class);
Route::get('/cities/{id}/towns', [CityController::class, 'towns']);
Route::get('/cities/{id}/villages', [CityController::class, 'villages']);
Route::get('/cities/{id}/hierarchy', [CityController::class, 'hierarchy']);

// Town API
Route::apiResource('towns', TownController::class);

// Village API
Route::apiResource('villages', VillageController::class);


// Location API - Hierarchical structure: Province -> City -> Town/Village

// Main location endpoints
Route::get('/locations/hierarchy', [LocationController::class, 'hierarchy']);
Route::get('/locations/search', [LocationController::class, 'search']);
Route::get('/locations/statistics', [LocationController::class, 'statistics']);
Route::get('/locations/breadcrumb', [LocationController::class, 'breadcrumb']);
Route::get('/locations/provinces/{id}/hierarchy', [LocationController::class, 'provinceHierarchy']);
Route::get('/locations/cities/{id}/hierarchy', [LocationController::class, 'cityHierarchy']);

// Province API
Route::apiResource('provinces', ProvinceController::class);
Route::get('/provinces/{id}/cities', [ProvinceController::class, 'cities']);
Route::get('/provinces/{id}/hierarchy', [ProvinceController::class, 'hierarchy']);

// City API
Route::apiResource('cities', CityController::class);
Route::get('/cities/{id}/towns', [CityController::class, 'towns']);
Route::get('/cities/{id}/villages', [CityController::class, 'villages']);
Route::get('/cities/{id}/hierarchy', [CityController::class, 'hierarchy']);

// Town API
Route::apiResource('towns', TownController::class);

// Village API
Route::apiResource('villages', VillageController::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Incidents
    Route::get('/incidents', [IncidentController::class, 'index']);
    Route::post('/incidents', [IncidentController::class, 'store']);
});

// Operational Center API
Route::apiResource('operational-centers', OperationalCenterController::class);

// Operational Support Home API
Route::apiResource('operational-support-homes', OperationalSupportHomeController::class);