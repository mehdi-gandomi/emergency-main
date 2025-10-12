<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('operational_centers', function (Blueprint $table) {
            $table->unsignedSmallInteger('id')->primary();
            $table->unsignedTinyInteger('province_id')->comment('استان');
            $table->unsignedSmallInteger('branches_id')->comment('شعبه');
            $table->unsignedTinyInteger('type_operational_center')->comment('نوع مرکز عملیاتی');
            $table->tinyInteger('account_type')->nullable()->comment('نوع کاربری');
            $table->string('title', 70)->comment('نام مرکز عملیاتی');
            $table->string('coding_old', 11)->nullable()->comment('کدینگ');
            $table->string('coding', 11)->default('')->comment('کدینگ');
            $table->tinyInteger('three_digit_code_new')->nullable()->comment('کد مرکز عملیاتی');
            $table->string('activity_days', 65)->default('Saturday,Sunday,Monday,Tuesday,Wednesday,Thursday,Friday')->comment('روزهای فعالیت');
            $table->string('date_activity_days', 10)->nullable()->comment('تاریخ اعمال روزهای فعالیت');
            $table->tinyInteger('type_ownership')->nullable()->comment('نوع مالکیت');
            $table->tinyInteger('type_structure')->nullable()->comment('نوع سازه');
            $table->string('start_activity', 10)->nullable()->comment('آغاز فعالیت');
            $table->string('end_activity', 10)->nullable()->comment('پایان فعالیت');
            $table->string('memory_martyr', 50)->nullable()->comment('یادمان شهید');
            $table->tinyInteger('seasonal_type')->nullable()->comment('نوع فصلی');
            $table->tinyInteger('occasional_id')->nullable()->comment('عنوان مناسبتی');
            $table->tinyInteger('three_digit_code')->nullable()->comment('کد مرکز عملیاتی');
            $table->tinyInteger('license_status')->nullable()->comment('وضعیت مجوز پایگاه امدادی');
            $table->string('phone', 11)->comment('تلفن');
            $table->string('fixed_number', 11)->comment('شماره ثابت');
            $table->string('mobile', 11)->comment('شماره همراه');
            $table->string('fax', 11)->comment('شماره فکس');
            $table->string('vhf_address', 20)->nullable()->comment('کد خطاب VHF');
            $table->string('hf_address', 20)->nullable()->comment('کد خطاب HF');
            $table->string('vhf_channel', 20)->nullable()->comment('کانال VHF');
            $table->string('satellite_phone', 11)->nullable()->comment('شماره تلفن ماهواره ای ثابت');
            $table->double('lon')->nullable()->comment('طول جغرافیایی(E)');
            $table->double('lat')->nullable()->comment('عرض جغرافیایی(N)');
            $table->string('length', 12)->nullable()->comment('طول جغرافیایی(E)');
            $table->string('width', 12)->nullable()->comment('عرض جغرافیایی(N)');
            $table->integer('height')->nullable()->comment('ارتفاع');
            $table->string('arena', 10)->nullable()->comment('عرصه');
            $table->string('ayan', 10)->nullable()->comment('اعیان');
            $table->string('img_header', 250)->nullable()->comment('تصویر سر درب مرکز عملیاتی');
            $table->string('img_license', 250)->nullable()->comment('تصویر مجوز فعالیت');
            $table->string('bfile1', 15)->nullable();
            $table->string('bfile2', 15)->nullable();
            $table->string('address', 150)->comment('آدرس پستی');
            $table->tinyText('description')->nullable()->comment('توضیحات');
            $table->string('postal_code', 10)->nullable()->comment('کد پستی');
            $table->tinyInteger('place_payment')->comment('محل پرداخت');
            $table->tinyInteger('type_personnel_emis')->default(0)->comment('نوع فرد کشیک');
            $table->float('kilometer')->unsigned()->default(0)->comment('فاصله تا شعبه');
            $table->tinyInteger('status')->comment('وضعیت');
            $table->tinyInteger('status_emis')->nullable()->comment('وضعیت سامانه emis');
            $table->tinyInteger('status_equipment')->nullable()->comment('وضعیت سامانه تجهیزات');
            $table->tinyInteger('status_dims')->nullable()->comment('وضعیت سامانه dmis');
            $table->tinyInteger('status_air_relief')->nullable()->comment('وضعیت سامانه امداد هوایی');
            $table->tinyInteger('status_memberrcs')->nullable()->comment('وضعیت سامانه ساجد');
            $table->tinyInteger('status_emdadyar')->nullable()->comment('وضعیت سامانه امدادگران');
            $table->tinyInteger('status_webgis')->nullable()->comment('وضعیت webgis');
            $table->integer('raromis_id')->nullable();
            $table->integer('member_id')->nullable();
            $table->integer('emdadyar_id')->nullable()->comment('معادل کد امدادیار');
            $table->tinyInteger('update_emdadyar_id')->nullable()->comment('کد امدادیار به‌روز شده؟');
            $table->tinyInteger('not_conditions')->default(0)->comment('شرط emis (0:اعمال 1:عدم اعمال)');
            $table->tinyInteger('not_conditions_t')->default(0)->comment('عدم اعمال شرط توالی emis');
            $table->tinyInteger('conditions_inc')->default(0)->comment('شرط افزایش سقف شیفت emis');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('operational_centers');
    }
};
