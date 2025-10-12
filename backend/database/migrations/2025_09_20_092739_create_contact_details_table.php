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
        Schema::create('contact_details', function (Blueprint $table) {
            $table->integer('id')->primary()->comment('کد');
            $table->unsignedBigInteger('contact_id')->comment('کد اطلاعات تماس');
            $table->integer('province_id')->nullable()->comment('استان');
            $table->integer('city_id')->nullable()->comment('شهرستان');
            $table->integer('city_id_old')->nullable();
            $table->integer('town_id')->nullable()->comment('شهر');
            $table->integer('village_id')->nullable()->comment('روستا');
            $table->string('lon', 255)->nullable()->comment('طول جغرافیایی');
            $table->string('lat', 255)->nullable()->comment('عرض جغرافیایی');
            $table->string('height', 6)->nullable()->comment('ارتفاع');
            $table->string('width', 12)->nullable()->comment('عرض جغرافیایی');
            $table->string('length', 12)->nullable()->comment('طول جغرافیایی');
            $table->string('main_street', 100)->nullable()->comment('خیابان اصلی');
            $table->string('sub_street', 100)->nullable()->comment('خیابان فرعی');
            $table->text('address')->comment('آدرس');
            $table->tinyInteger('event_environment_type')->nullable()->comment('محیط حادثه');
            $table->string('event_environment_name', 255)->nullable()->comment('نام محیط حادثه');
            $table->tinyInteger('type_mountain')->nullable()->comment('نوع کوهستان');
            $table->tinyInteger('climb_route')->nullable()->comment('مسیر صعود');
            $table->tinyInteger('climb_route_direction')->nullable()->comment('جهت مسیر صعود');
            $table->integer('event_place')->nullable()->comment('محل حادثه');
            $table->string('event_place_name', 150)->nullable()->comment('نام محل حادثه');
            $table->text('axis_name')->nullable()->comment('نام محور');
            $table->integer('city_start_id')->nullable()->comment('شهر مبدا');
            $table->integer('city_end_id')->nullable()->comment('شهر مقصد');
            $table->string('km_axis', 70)->nullable()->comment('کیلومتر محور');
            $table->string('nech_name', 100)->nullable()->comment('نام گردنه');
            $table->string('parish_name', 100)->nullable()->comment('نام محله');
            $table->string('car_num', 10)->nullable()->comment('تعداد خودروی آسیب دیده');
            $table->string('plaque', 20)->nullable()->comment('پلاک');
            $table->string('fgh_name', 255)->nullable()->comment('نام کارخانه/باغ/منزل مسکونی');
            $table->integer('event_people_num')->nullable()->comment('تعداد افراد حادثه دیده');
            $table->integer('injured_num')->nullable()->comment('تعداد مصدوم');
            $table->integer('feet_num')->nullable()->comment('تعداد فوتی');
            $table->integer('healthy_people_num')->nullable()->comment('تعداد افراد سالم');
            $table->integer('prisoners_num')->nullable()->comment('تعداد محبوسین');
            $table->string('trauma_type', 30)->nullable()->comment('نوع تروما یا مصدومیت');
            $table->string('trauma_member', 20)->nullable()->comment('عضو دچار تروما شده');
            $table->string('caller_name', 150)->nullable()->comment('نام و نام خانوادگی تماس گیرنده');
            $table->string('call_track', 11)->nullable()->comment('شماره تماس پیگیری');
            $table->tinyInteger('ratio')->nullable()->comment('نسبت با فرد حادثه دیده');
            $table->string('event_date', 10)->nullable()->comment('تاریخ احتمالی وقوع حادثه');
            $table->string('event_time', 8)->nullable()->comment('ساعت احتمالی وقوع حادثه');
            $table->string('operator_date', 10)->nullable()->comment('تاریخ ارجاع به اپراتور دیسپچ');
            $table->string('operator_time', 8)->nullable()->comment('ساعت ارجاع به اپراتور دیسپچ');
            $table->string('user_date', 10)->nullable()->comment('تاریخ ارجاع به کاربر پایگاه');
            $table->string('user_time', 8)->nullable()->comment('ساعت ارجاع به کاربر پایگاه');
            $table->timestamps();
            // کلید خارجی
            // $table->foreign('contact_id')->references('id')->on('contact')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_details');
    }
};
