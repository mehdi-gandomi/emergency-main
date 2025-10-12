<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->primary();
            $table->unsignedTinyInteger('province_id')->comment('استان'); // مطابق DDL: ZEROFILL
            $table->unsignedTinyInteger('branch_type')->comment('نوع شعبه');
            $table->integer('parent_branch_id')->nullable()->comment('شعبه والد');
            $table->string('title', 40)->comment('نام شعبه');
            $table->string('two_digit_code_old', 2)->nullable()->comment('کد دو رقمی شعبه');
            $table->string('two_digit_code', 2)->nullable()->comment('کد دو رقمی شعبه');
            $table->string('date_establishment', 10)->nullable()->comment('تاریخ تاسیس');
            $table->string('phone', 11)->nullable()->comment('شماره تماس');
            $table->string('fax', 11)->nullable()->comment('شماره فکس شعبه');
            $table->string('vhf_address', 20)->nullable()->comment('کد خطاب VHF');
            $table->string('hf_address', 20)->nullable()->comment('کد خطاب HF');
            $table->string('vhf_channel', 20)->nullable()->comment('کانال VHF');
            $table->double('lon')->comment('طول جغرافیایی(E)');
            $table->double('lat')->comment('عرض جغرافیایی(N)');
            $table->string('length', 12)->nullable()->comment('طول جغرافیایی(E)');
            $table->string('width', 12)->nullable()->comment('عرض جغرافیایی(N)');
            $table->string('height', 6)->comment('ارتفاع');
            $table->string('img_header', 250)->nullable()->comment('تصویر سردرب شعبه');
            $table->string('img_building', 250)->nullable()->comment('تصویر ساختمان شعبه');
            $table->string('bfile1', 15)->nullable();
            $table->string('bfile2', 15)->nullable();
            $table->string('address', 150)->nullable()->comment('آدرس پستی(نشانی)');
            $table->tinyText('description')->nullable()->comment('توضیحات');
            $table->string('postal_code', 10)->nullable()->comment('کد پستی');
            $table->tinyInteger('status')->nullable()->comment('وضعیت');
            $table->tinyInteger('status_emis')->default(1)->comment('وضعیت سامانه emis');
            $table->tinyInteger('status_equipment')->default(1)->comment('وضعیت سامانه تجهیزات');
            $table->tinyInteger('status_dims')->default(1)->comment('وضعیت dmis');
            $table->tinyInteger('status_air_relief')->default(1)->comment('وضعیت امداد هوایی');
            $table->tinyInteger('status_memberrcs')->default(1)->comment('وضعیت سامانه ساجد');
            $table->tinyInteger('status_emdadyar')->default(1)->comment('وضعیت سامانه امدادگران');
            $table->tinyInteger('status_webgis')->default(1)->comment('وضعیت webgis');
            $table->string('coding_old', 6)->nullable()->comment('کدینگ');
            $table->string('coding', 6)->nullable()->comment('کدینگ');
            $table->integer('raromis_id')->nullable();
            $table->integer('member_id')->nullable();
            $table->tinyInteger('closed_thursday')->default(0)->comment('پنجشنبه تعطیل است؟');
            $table->string('date_closed_thursday', 10)->nullable()->comment('تاریخ اعمال شدن تعطیلی پنجشنبه ها');
            $table->string('date_closed_thursday_end', 10)->nullable();
            $table->integer('emdadyar_id')->nullable();
            $table->integer('city_id')->nullable()->comment('کد جدول city');
            $table->tinyInteger('type')->default(0)->comment('نوع ستادی برای فرم شهرستان');
            $table->tinyInteger('center')->nullable()->comment('نوع مرکزی برای فرم شهرستان');
            $table->string('full_name_governor', 50)->nullable()->comment('نام و نام خانوادگی فرماندار');
            $table->string('phone_governor', 11)->nullable()->comment('شماره تماس فرماندار');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
