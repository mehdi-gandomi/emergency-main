<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('login_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('personnel_id')->nullable();
            $table->string('user_type', 50)->nullable();
            $table->string('ip', 64)->nullable();
            $table->string('extension', 64)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('shift_data')->nullable();
            $table->json('request_payload')->nullable();
            $table->boolean('success')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_logs');
    }
};


