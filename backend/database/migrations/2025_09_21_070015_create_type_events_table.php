<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('type_events', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary()->comment('کد');
            $table->string('title', 60)->comment('عنوان فارسی');
            $table->string('en_title', 60)->nullable()->comment('عنوان انگلیسی');
            $table->string('ar_title', 60)->nullable()->comment('عنوان عربی');
            $table->unsignedTinyInteger('type_event_id')->default(0)->comment('عنوان پدر');
            $table->longText('coding')->nullable();
            $table->unsignedTinyInteger('type_event_id_rep')->default(0)->comment('کد نوع حادثه پدر برای گزارش مثلا pbi');
            $table->tinyInteger('report_criteria')->default(0)->comment('ملاک گزارشات (1:آری،0:خیر)');
            $table->unsignedTinyInteger('equivalent')->nullable()->comment('معادل در سامانه قدیم');
            $table->string('icon_path', 40)->comment('آیکون');
            $table->tinyInteger('show_map')->default(1)->comment('نمایش روی نقشه');
            $table->tinyInteger('display_registration_form')->default(1)->comment('نمایش داخل فرم ثبت حادثه');
            $table->tinyInteger('show_app')->default(1)->comment('نمایش داخل اپلیکیشن');
            $table->tinyInteger('state')->default(1)->comment('وضعیت');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('type_events');
    }
};
