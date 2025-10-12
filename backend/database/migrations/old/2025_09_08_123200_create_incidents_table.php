<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('caller_number')->nullable();
            $table->string('caller_first_name')->nullable();
            $table->string('caller_last_name')->nullable();
            $table->string('location')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('incident_type')->nullable();
            $table->string('priority')->nullable();
            $table->text('description')->nullable();
            $table->string('victims')->nullable();
            $table->dateTime('time_of_incident')->nullable();
            $table->string('contact_type')->nullable();
            $table->string('emdadi_detail')->nullable();
            $table->string('nuisance_type')->nullable();
            $table->string('incident_source_location')->nullable();
            $table->string('incident_declaration_source')->nullable();
            $table->json('organizational_source')->nullable();
            $table->string('public_source')->nullable();
            $table->string('relative_type')->nullable();
            $table->string('number_of_injured')->nullable();
            $table->string('number_of_vehicles')->nullable();
            $table->string('number_of_trapped')->nullable();
            $table->string('number_of_houses')->nullable();
            $table->text('main_complaint')->nullable();
            $table->string('cooperating_organizations')->nullable();
            $table->string('age')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};


