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
        Schema::table('logout_events', function (Blueprint $table) {
            // Drop existing columns if they exist
            if (Schema::hasColumn('logout_events', 'user_id')) {
                $table->dropColumn('user_id');
            }
            if (Schema::hasColumn('logout_events', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('logout_events', 'duration')) {
                $table->dropColumn('duration');
            }
            if (Schema::hasColumn('logout_events', 'supervisor_approval')) {
                $table->dropColumn('supervisor_approval');
            }
            if (Schema::hasColumn('logout_events', 'sms_sent')) {
                $table->dropColumn('sms_sent');
            }

            // Add new columns
            $table->unsignedBigInteger('personnel_id')->after('id');
            $table->string('reason')->after('personnel_id');
            $table->timestamp('date')->after('reason');
            $table->text('description')->nullable()->after('date');
            $table->boolean('alarm_status')->default(false)->after('description');
            
            // Add foreign key
            $table->foreign('personnel_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('logout_events', function (Blueprint $table) {
            // Drop new columns
            $table->dropForeign(['personnel_id']);
            $table->dropColumn(['personnel_id', 'reason', 'date', 'description', 'alarm_status']);
            
            // Restore original columns
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('type')->nullable();
            $table->text('description')->nullable();
            $table->integer('duration')->nullable();
            $table->boolean('supervisor_approval')->default(false);
            $table->boolean('sms_sent')->default(false);
        });
    }
};