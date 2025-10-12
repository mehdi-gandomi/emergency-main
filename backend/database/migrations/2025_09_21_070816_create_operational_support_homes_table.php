<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('operational_support_homes', function (Blueprint $table) {
            $table->integer('id')->primary()->comment('کد مرکز پشتیبان عملیات');
            $table->unsignedTinyInteger('province_id')->comment('استان');
            $table->integer('branches_id')->comment('شعبه');
            $table->integer('city_id')->nullable()->comment('شهرستان');
            $table->integer('section_id')->nullable()->comment('بخش');
            $table->tinyInteger('area_type')->nullable()->comment('نوع منطقه(0 منطقه شهری 1 منطقه روستایی)');
            $table->unsignedInteger('town_id')->nullable()->comment('شهر');
            $table->string('district', 50)->nullable()->comment('محله');
            $table->unsignedInteger('rural_district_id')->nullable()->comment('دهستان');
            $table->string('village_id', 250)->nullable()->comment('روستا');
            $table->string('title', 35)->comment('نام مرکزپشتیبان عملیاتی');
            $table->string('three_digit_code', 3)->comment('کد مرکزپشتیبان عملیاتی');
            $table->string('fixed_number', 11)->comment('شماره ثابت');
            $table->string('fax', 11)->nullable()->comment('شماره فکس');
            $table->string('mobile', 11)->nullable()->comment('شماره همراه');
            $table->double('lon')->comment('طول جغرافیایی(E)');
            $table->double('lat')->comment('عرض جغرافیایی(N)');
            $table->string('length', 12)->comment('طول جغرافیایی(E)');
            $table->string('width', 12)->comment('عرض جغرافیایی(N)');
            $table->string('height', 6)->comment('ارتفاع');
            $table->string('img_header', 250)->nullable()->comment('تصویر سر درب');
            $table->string('img_building', 250)->nullable()->comment('تصویر ساختمان');
            $table->string('address', 150)->comment('آدرس پستی');
            $table->tinyText('description')->nullable()->comment('توضیحات');
            $table->string('postal_code', 10)->nullable()->comment('کد پستی');
            $table->string('fullname', 150)->nullable()->comment('نام ونام خانوادگی مسئول خانه هلال');
            $table->string('national_code', 10)->nullable()->comment('کد ملی');
            $table->tinyInteger('status')->comment('وضعیت');
            $table->tinyInteger('status_emis')->nullable()->comment('وضعیت سامانه emis');
            $table->tinyInteger('status_equipment')->nullable()->comment('وضعیت سامانه تجهیزات');
            $table->tinyInteger('status_dims')->nullable()->comment('وضعیت سامانه dmis');
            $table->tinyInteger('status_air_relief')->nullable()->comment('وضعیت سامانه امداد هوایی');
            $table->tinyInteger('status_memberrcs')->nullable()->comment('وضعیت سامانه ساجد');
            $table->tinyInteger('status_emdadyar')->nullable()->comment('وضعیت سامانه امدادگران');
            $table->tinyInteger('status_webgis')->nullable()->comment('وضعیت webgis');
            $table->string('coding', 11)->nullable()->comment('کدینگ');
        });

        // توضیح جدول (اختیاری)
        // DB::statement("ALTER TABLE `operational_support_homes` COMMENT = 'مراکزپشتیبان عملیات(خانه هلال،اتاق آماده عملیات،...)'");
    }

    public function down(): void
    {
        Schema::dropIfExists('operational_support_homes');
    }
};
