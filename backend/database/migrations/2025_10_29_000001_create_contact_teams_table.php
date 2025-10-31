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
        Schema::create('contact_teams', function (Blueprint $table) {
            $table->unsignedBigInteger('contact_id');
            $table->unsignedInteger('team_id');
            $table->unsignedSmallInteger('count')->default(1);

            $table->primary(['contact_id', 'team_id']);

            // $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
            // $table->foreign('team_id')->references('id')->on('team')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_teams');
    }
};


