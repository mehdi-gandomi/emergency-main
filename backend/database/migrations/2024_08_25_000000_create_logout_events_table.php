<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('logout_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personnel_id')->constrained('users');
            $table->string('reason');
            $table->timestamp('date');
            $table->text('description')->nullable();
            $table->boolean('alarm_status')->default(false);
            $table->integer('duration')->nullable();
            $table->boolean('supervisor_approval')->default(false);
            $table->boolean('sms_sent')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logout_events');
    }
};