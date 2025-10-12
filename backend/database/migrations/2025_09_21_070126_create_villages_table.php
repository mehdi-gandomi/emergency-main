<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('villages', function (Blueprint $table) {
            $table->unsignedInteger('id')->primary();
            $table->string('OBJECTID', 100)->nullable();
            $table->string('Abadi_Code', 6)->nullable();
            $table->string('ADRES1395', 20)->nullable();
            $table->string('title', 200)->nullable()->comment('عنوان');
            $table->unsignedTinyInteger('province_id')->default(0)->comment('کد استان');
            $table->unsignedSmallInteger('city_id')->nullable()->comment('کد شهرستان');
            $table->unsignedSmallInteger('rural_district_id')->comment('کد دهستان');
            $table->double('lon_old')->nullable()->comment('طول جغرافیایی');
            $table->double('lat_old')->nullable()->comment('عرض جغرافیایی');
            $table->double('lat')->nullable();
            $table->double('lon')->nullable();
            $table->tinyInteger('state')->default(1)->comment('وضعیت(0:غیرفعال،1:فعال)');
            $table->string('ostan', 18)->nullable()->comment('نام استان');
            $table->string('OstanCode', 5)->nullable()->comment('کد استان');
            $table->string('city', 30)->nullable()->comment('نام شهرستان');
            $table->string('ShahrestanCode', 5)->nullable()->comment('کد شهرستان');
            $table->string('bakhsh', 17)->nullable()->comment('نام بخش');
            $table->string('BakhshCode', 5)->nullable()->comment('کد بخش');
            $table->string('dehestan', 28)->nullable()->comment('نام شهر/ دهستان');
            $table->string('ShrDeh', 5)->nullable()->comment('کد شهر/دهستان');
            $table->unsignedSmallInteger('Hozeh')->nullable()->comment('کد حوزه');
            $table->string('BlkAbdName', 67)->nullable()->comment('نام آبادی');
            $table->string('BlkAbd', 20)->nullable()->comment('کد آبادی');
            $table->string('jam', 5)->nullable()->comment('جمعیت کل');
            $table->string('men', 5)->nullable()->comment('جمعیت مرد');
            $table->string('women', 5)->nullable()->comment('جمعیت زن');
            $table->string('khanevar', 5)->nullable()->comment('تعداد کل خانوار');
            $table->tinyInteger('update_ids')->default(0);
            $table->string('va_phone', 11)->nullable();
            $table->string('va_mobile', 11)->nullable();
            $table->string('va_name', 50)->nullable();
            $table->string('council_phone1', 11);
            $table->string('council_phone2', 11);
            $table->string('council_phone3', 11);
            $table->string('inter_cres', 15);
            $table->string('txt', 100)->nullable();
            $table->tinyInteger('radius')->nullable();
            $table->tinyInteger('center')->nullable();
            $table->tinyInteger('type')->nullable();
            $table->string('width', 20)->nullable();
            $table->string('length', 20)->nullable();
            $table->string('height', 5)->nullable();
            $table->integer('village_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('villages');
    }
};
