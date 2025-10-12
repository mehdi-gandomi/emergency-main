<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('towns', function (Blueprint $table) {
            $table->smallInteger('id')->primary()->comment('1');
            $table->string('OBJECTID', 100)->nullable();
            $table->unsignedSmallInteger('town_id_old')->nullable()->comment('0');
            $table->string('title', 30)->nullable()->comment('نام شهر/ دهستان');
            $table->unsignedTinyInteger('province_id')->nullable()->comment('0');
            $table->unsignedSmallInteger('city_id')->nullable()->comment('0');
            $table->string('lat', 50)->nullable()->comment('عرض جغرافیایی');
            $table->string('lon', 50)->nullable()->comment('طول جغرافیایی');
            $table->unsignedSmallInteger('section_id')->nullable()->comment('1');
            $table->string('A', 18)->nullable()->comment('نام استان');
            $table->string('B', 8)->nullable()->comment('کد استان');
            $table->string('C', 30)->nullable()->comment('نام شهرستان');
            $table->string('D', 10)->nullable()->comment('کد شهرستان');
            $table->string('E', 17)->nullable()->comment('نام بخش');
            $table->string('F', 6)->nullable()->comment('کد بخش');
            $table->string('code', 10)->nullable()->comment('کد شهر');
            $table->string('I', 6)->nullable()->comment('کدحوزه');
            $table->string('J', 10)->nullable()->comment('نام آبادی');
            $table->string('K', 8)->nullable()->comment('کد آبادی');
            $table->string('L', 51)->nullable()->comment('کد ۴رقمی آبادی با نقشه بلوکه (رکورد 7)');
            $table->string('M', 48)->nullable()->comment('شماره حوزه آبادی با نقشه بلوکه (رکورد 7)');
            $table->string('N', 56)->nullable()->comment('شماره ۳رقمی بلوک آبادی با نقشه بلوکه (رکورد 7)');
            $table->string('O', 8)->nullable()->comment('کد رکورد');
            $table->string('P', 17)->nullable()->comment('نام سطح جغرافیایی');
            $table->string('Q', 51)->nullable()->comment('کد ۴رقمی آبادی با نقشه بلوکه (رکورد 8)');
            $table->string('town_code', 69)->nullable()->comment('کد شهر مادر');
            $table->string('S', 18)->nullable()->comment('شهر منطقه‌بندی شده');
            $table->string('jam', 8)->nullable()->comment('جمعیت کل');
            $table->string('men', 9)->nullable()->comment('جمعیت مرد');
            $table->string('women', 8)->nullable()->comment('جمعیت زن');
            $table->string('khanevar', 15)->nullable()->comment('تعداد کل خانوار');
            $table->string('height', 5)->nullable();
            $table->string('width', 20)->nullable();
            $table->string('length', 20)->nullable();
            $table->tinyInteger('center')->default(0);
            $table->string('governor_name', 50)->nullable();
            $table->string('governor_mobile', 12)->nullable();
            $table->string('governor_phone', 12)->nullable();
            $table->string('mayor_name', 50)->nullable();
            $table->string('mayor_mobile', 12)->nullable();
            $table->string('mayor_phone', 12)->nullable();
            $table->string('txt', 100)->nullable();
            $table->tinyInteger('type')->default(1);
            $table->tinyInteger('state')->default(1);
            $table->string('branch_phone', 11)->nullable();
            $table->tinyInteger('radius')->nullable();
            $table->string('council_phone', 11)->nullable();
            $table->string('address', 150)->nullable();
            $table->tinyInteger('town_id')->nullable()->comment('کد شهر برای موارد خاص');
            $table->integer('sub_town_id')->nullable()->comment('زیر مجموعه شهر');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('towns');
    }
};
