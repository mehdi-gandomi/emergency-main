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
        Schema::create('contacts', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary()->comment('کد');
            $table->smallInteger('operator_id')->comment('کد اپراتور');
            $table->tinyInteger('province_id')->default(0)->comment('کد استان ثبت کننده');
            $table->integer('phone_in')->comment('تلفن داخلی اپراتور');
            $table->string('date_call', 10)->comment('تاریخ تماس');
            $table->string('time_call', 11)->comment('ساعت تماس');
            $table->string('mobile', 11)->comment('شماره تماس گیرنده');
            $table->tinyInteger('type_call')->comment('نوع تماس');
            $table->tinyInteger('type_report')->default(0)->comment('نوع گزارش(عملیات1،خدمات2)');
            $table->tinyInteger('report_event')->nullable()->comment('نوع حادثه اعلامی');
            $table->tinyInteger('device')->nullable()->comment('نام دستگاه');
            $table->tinyInteger('event_details')->nullable()->comment('درحال انجام/پایان عملیات');
            $table->integer('event_follow_id')->nullable()->comment('نمایش اطلاعات حادثه(پیگیری حادثه اعلامی)');
            $table->integer('event_repetitive_id')->default(0)->comment('نمایش اطلاعات حادثه(تکراری)');
            $table->text('text')->comment('شرح مختصر حادثه');
            $table->tinyInteger('alarm')->nullable()->comment('آلارم');
            $table->integer('created_personnel_id')->nullable()->comment('شخص ثبت کننده');
            // $table->string('created_at', 19)->nullable()->comment('زمان ثبت');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
