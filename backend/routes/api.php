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
use App\Http\Controllers\API\TeamController;
use App\Http\Controllers\API\RecordPersonsStatusController;
use App\Http\Controllers\API\SendDispatchNotificationMissionController;
use App\Http\Controllers\API\VehicleController;
use App\Http\Controllers\API\ProvinceAssistingController;
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/vehicles', [VehicleController::class, 'index']);
Route::get('/provinces/assisting', [ProvinceAssistingController::class, 'index']);
Route::get('/contact-events', [EventController::class, 'contactEvents']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/initial-reports', [EventController::class, 'initialReports']);
Route::get('/initial-reports/{id}', [EventController::class, 'initialReportsShow']);
Route::get('/contact-events/{id}', [EventController::class, 'contactEventsShow']);

// Personnel Status routes
Route::get('/active-personnel', [RecordPersonsStatusController::class, 'getActivePersonnelByLocation']);

// Dispatch Notification routes
Route::post('/dispatch/send-notification', [SendDispatchNotificationMissionController::class, 'sendDispatchNotification']);
Route::get('/dispatch/status/{missionId}', [SendDispatchNotificationMissionController::class, 'getDispatchStatus']);
Route::post('/dispatch/update-status', [SendDispatchNotificationMissionController::class, 'updateNotificationStatus']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-personnel', [AuthController::class, 'verifyPersonnel']);
Route::post('/logout', [\App\Http\Controllers\Auth\LogoutController::class, 'logout'])->middleware('auth:sanctum');
Route::apiResource('contacts', ContactController::class);


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
        $data=$request->user()->load('personnel','personnel.profileUpload','personnel.personnel_mobile');
        $data=$data ? $data->toArray():[];
        if(isset($data['personnel']) && isset($data['personnel']['profile_upload'])){
            $data['avatar']="http://raromis.ir/upload/members/personal_img/".$data['personnel']['profile_upload']['file'];
        }
        if(isset($data['personnel']) && isset($data['personnel']['personnel_mobile'])){
            $data['mobile']=$data['personnel']['personnel_mobile']['phone'];
        }
        return [
            'status'=>'success',
            'data'=>$data
        ];
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