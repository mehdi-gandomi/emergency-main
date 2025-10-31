<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('contact_id');
            $table->unsignedInteger('vehicle_id');
            $table->unsignedSmallInteger('count')->default(1);

            $table->primary(['contact_id', 'vehicle_id']);

            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_vehicles');
    }
};


