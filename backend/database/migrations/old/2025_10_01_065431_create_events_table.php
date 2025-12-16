<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id(); // int unsigned auto_increment

            $table->tinyInteger('num_report')->unsigned()->default(0)->comment('شماره گزارش');
            $table->integer('initial_report_id')->unsigned()->default(0)->comment('کد حادثه در فرم گزارش اولیه');
            $table->tinyInteger('base_type')->default(0)->comment('نوع پایگاه(1پشتیبان/0اصلی/-1تنظیم نشده)');
            $table->tinyInteger('result_person_visit')->unsigned()->default(0)->comment('نتیجه مراجعه حضوری');
            $table->unsignedBigInteger('parent_events_id')->default(0)->comment('کد حادثه پدر');
            $table->unsignedBigInteger('parent_details_events_id')->default(0)->comment('کد جزئیات حادثه پدر');
            $table->string('glide_number', 18)->nullable()->comment('کد کمک بین‌الملل');
            $table->smallInteger('weather_warnings_id')->unsigned()->default(0)->comment('کد هشدار هواشناسی');
            $table->tinyInteger('mountain_accident_type')->default(0)->comment('نوع حادثه کوهستان');
            $table->tinyInteger('environment_mountain_incident')->default(0)->comment('محیط حادثه کوهستان');
            $table->tinyInteger('access_transport_injured_person')->unsigned()->default(0)->comment('نحوه دسترسی و انتقال مصدوم');
            $table->mediumInteger('from_height')->unsigned()->default(0)->comment('از ارتفاع(متر)');
            $table->mediumInteger('length_access_transfer_workshops')->unsigned()->default(0)->comment('طول کارگاه‌های دسترسی و انتقال(متر)');
            $table->mediumInteger('total_distance_traveled_during_transportation')->unsigned()->default(0)->comment('کل مسافت طی‌شده در زمان حمل(متر)');
            $table->tinyInteger('aquatic_environment_type')->unsigned()->default(0)->comment('نوع محیط‌های آبی');
            $table->tinyInteger('aquatic_environment_place')->unsigned()->default(0)->comment('محل وقوع محیط‌های آبی');
            $table->tinyInteger('sanitation_plan_zone')->unsigned()->default(0)->comment('محدوده طرح سالم‌سازی');
            $table->tinyInteger('type_report')->default(1)->comment('نوع گزارش(عملیات1،خدمات2)');
            $table->tinyInteger('type_event_id')->unsigned()->comment('نوع حادثه');
            $table->string('detailed_description', 250)->comment('شرح دقیق حادثه');
            $table->tinyInteger('level')->default(-1)->comment('سطح/وسعت حادثه');
            $table->tinyInteger('dispatch_province_id')->unsigned()->nullable()->comment('استان محل اعزام');
            $table->smallInteger('dispatch_branches_id')->unsigned()->nullable()->comment('شعبه محل اعزام');
            $table->smallInteger('dispatch_operational_centers_id')->unsigned()->nullable()->comment('مرکز عملیاتی محل اعزام');

            // زمان‌های عددی/متنی
            $table->unsignedBigInteger('contact_times_112')->nullable()->comment('زمان عددی تماس با 112');
            $table->string('contact_date_112', 10)->nullable()->comment('تاریخ تماس با 112');
            $table->string('contact_time_112', 5)->nullable()->comment('ساعت تماس با 112');

            $table->unsignedBigInteger('times_inform_population')->nullable()->comment('زمان اطلاع جمعیت');
            $table->string('date_inform_population', 10)->nullable()->comment('تاریخ اطلاع جمعیت');
            $table->string('time_inform_population', 5)->nullable()->comment('ساعت اطلاع جمعیت');

            $table->unsignedBigInteger('times_accident')->nullable()->comment('زمان وقوع حادثه');
            $table->string('date_accident', 10)->nullable()->comment('تاریخ وقوع حادثه');
            $table->string('time_accident', 5)->nullable()->comment('ساعت وقوع حادثه');

            $table->unsignedBigInteger('times_notify_base')->nullable()->comment('زمان اعلام به پایگاه');
            $table->string('date_notify_base', 10)->nullable()->comment('تاریخ اعلام به پایگاه');
            $table->string('time_notify_base', 5)->nullable()->comment('ساعت اعلام به پایگاه');

            $table->unsignedBigInteger('times_inform_base')->nullable()->comment('زمان دریافت گزارش');
            $table->string('date_inform_base', 10)->nullable()->comment('تاریخ دریافت گزارش');
            $table->string('time_inform_base', 5)->nullable()->comment('ساعت دریافت گزارش');

            $table->unsignedBigInteger('moving_times_base')->nullable()->comment('زمان حرکت از پایگاه');
            $table->string('moving_date_base', 10)->nullable()->comment('تاریخ حرکت از پایگاه');
            $table->string('moving_time_base', 5)->nullable()->comment('ساعت حرکت از پایگاه');

            $table->unsignedBigInteger('operation_times')->nullable()->comment('زمان حضور در صحنه');
            $table->string('operation_date', 10)->nullable()->comment('تاریخ حضور در صحنه');
            $table->string('operation_time', 5)->nullable()->comment('ساعت حضور در صحنه');

            $table->unsignedBigInteger('times_leave_place_operation')->nullable()->comment('زمان ترک محل عملیات');
            $table->string('date_leave_place_operation', 10)->nullable()->comment('تاریخ ترک محل عملیات');
            $table->string('time_leave_place_operation', 5)->nullable()->comment('ساعت ترک محل عملیات');

            $table->tinyInteger('cancel_operations')->default(0)->comment('لغو عملیات');
            $table->unsignedBigInteger('cancel_operation_times')->nullable()->comment('زمان لغو عملیات');
            $table->string('cancel_operation_date', 10)->nullable()->comment('تاریخ لغو عملیات');
            $table->string('cancel_operation_time', 5)->nullable()->comment('ساعت لغو عملیات');
            $table->tinyInteger('reason_cancellation_operations_id')->unsigned()->nullable()->comment('علت لغو عملیات');

            $table->unsignedBigInteger('mission_end_times')->nullable()->comment('زمان پایان مأموریت');
            $table->string('mission_end_date', 10)->nullable()->comment('تاریخ پایان مأموریت');
            $table->string('mission_end_time', 5)->nullable()->comment('ساعت پایان مأموریت');

            $table->tinyInteger('source_accident_announcement_id')->unsigned()->comment('منبع اعلام حادثه');
            $table->tinyInteger('how_get_first_report')->unsigned()->comment('نحوه دریافت اولین گزارش');

            $table->integer('province_id')->comment('استان محل وقوع حادثه');
            $table->smallInteger('branches_id')->unsigned()->comment('شعبه محل وقوع حادثه');
            $table->smallInteger('operational_centers_id')->unsigned()->comment('نزدیک‌ترین مرکز عملیاتی');

            $table->tinyInteger('backup_bases_are_present')->unsigned()->default(0)->comment('پایگاه‌های پشتیبان (1/0)');
            $table->string('exact_location', 100)->nullable()->comment('محل دقیق حادثه');
            $table->decimal('distance_from_nearest_base', 6, 2)->nullable()->comment('فاصله از نزدیک‌ترین پایگاه (km)');
            $table->string('geographic_area', 200)->nullable()->comment('محدوده جغرافیایی');

            $table->double('lon')->comment('طول جغرافیایی(E)');
            $table->double('lat')->comment('عرض جغرافیایی(N)');
            $table->string('length', 12)->nullable()->comment('طول جغرافیایی (متنی)');
            $table->string('width', 12)->nullable()->comment('عرض جغرافیایی (متنی)');
            $table->mediumInteger('height')->unsigned()->nullable()->comment('ارتفاع');

            $table->tinyInteger('other_devices_present')->unsigned()->default(0)->comment('سایر دستگاه‌های حاضر');
            $table->unsignedBigInteger('times_send_inform_specific_bases')->nullable()->comment('زمان ارسال اطلاعات به پایگاه معین');
            $table->string('date_send_inform_specific_bases', 10)->nullable()->comment('تاریخ ارسال اطلاعات به پایگاه معین');
            $table->string('time_send_inform_specific_bases', 5)->nullable()->comment('ساعت ارسال اطلاعات به پایگاه معین');

            $table->tinyInteger('type_operation')->default(1)->comment('نوع عملیات');
            $table->tinyInteger('reasons_without_operational_action_id')->default(0)->comment('دلایل بدون اقدام عملیاتی');
            $table->tinyInteger('degree_importance_incident')->nullable()->comment('درجه اهمیت حادثه');
            $table->tinyInteger('view_monitoring_map')->default(1)->comment('نمایش روی نقشه مانیتورینگ');
            $table->string('more_details', 200)->nullable()->comment('توضیحات بیشتر');

            $table->integer('regulators')->comment('اپراتور دیسپچ (تنظیم‌کننده)');
            $table->integer('seconder')->comment('پرسنل کشیک (تأییدکننده)');

            $table->tinyInteger('temporary_end_operation')->default(0)->comment('پایان موقت عملیات');
            $table->text('description')->nullable()->comment('توضیحات');
            $table->tinyInteger('archived')->default(0)->comment('بایگانی');
            $table->tinyInteger('operation_status')->default(1)->comment("وضعیت عملیات (1:درحال انجام،2:پایان موقت،3:پایان عملیات)");

            // ایندکس‌ها (مطابق DDL)
            $table->index('type_event_id');
            $table->index('reason_cancellation_operations_id');
            $table->index('source_accident_announcement_id');
            $table->index('province_id');
            $table->index('branches_id');
            $table->index('regulators');
            $table->index('seconder');
            $table->index('operational_centers_id');
            $table->index('base_type');
            $table->index('times_accident');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
