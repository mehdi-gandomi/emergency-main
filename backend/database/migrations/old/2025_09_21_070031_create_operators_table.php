<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('operators', function (Blueprint $table) {
            $table->integer('id')->primary()->comment('کد');
            $table->integer('province_id')->comment('استان');
            $table->integer('city_id')->comment('شعبه');
            $table->integer('city_id_old')->nullable();
            $table->tinyInteger('type_person')->comment('نوع فرد(0:امدادگر-1:پرسنل)');
            $table->integer('member_id')->comment('فرد');
            $table->integer('personnel_id')->comment('پرسنل');
            $table->unsignedSmallInteger('code_operator')->comment('کد اپراتور (ZEROFILL)');
            $table->tinyInteger('type')->comment('نوع اپراتور (0:112 1:دیسپچ, 2:هردو)');
            $table->tinyInteger('state')->comment('وضعیت');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operators');
    }
};
