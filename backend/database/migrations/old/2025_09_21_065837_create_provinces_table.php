<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->integer('id')->primary()->comment('کد');
            $table->string('province_id1', 2)->nullable();
            $table->string('title', 30);
            $table->tinyInteger('ip')->nullable()->comment('استفاده جهت مرتبسازی');
            $table->tinyInteger('type')->default(0);
            $table->string('area_code', 3)->nullable();
            $table->string('hf_address', 20)->nullable()->comment('کد خطاب HF');
            $table->string('server_ip', 17)->nullable()->comment('ip سرور 112 استان');
            $table->tinyInteger('state')->default(1);
            $table->tinyInteger('serial');
            $table->unsignedTinyInteger('show_dmis')->default(1)->comment('نمایش داخل dmis و مشابه');
            $table->tinyInteger('show_pay')->default(1);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provinces');
    }
};
