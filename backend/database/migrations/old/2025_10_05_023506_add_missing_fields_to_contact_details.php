<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_details', function (Blueprint $table) {
            // Make address nullable to match actual structure
            $table->text('address')->nullable()->change();
            
            // Contact type and caller info
            $table->string('contact_type', 10)->nullable()->after('mission_notes')->comment('نوع تماس (اضطراری/غیراضطراری/مزاحم/ناتمام)');
            $table->string('caller_first_name', 100)->nullable()->after('contact_type')->comment('نام تماس گیرنده');
            $table->string('caller_last_name', 100)->nullable()->after('caller_first_name')->comment('نام خانوادگی تماس گیرنده');
            $table->integer('caller_age')->nullable()->after('caller_last_name')->comment('سن تماس گیرنده');
            
            // Location details
            $table->string('address', 255)->nullable()->after('caller_age')->comment('موقعیت مکانی');
$table->decimal('latitude', 10, 8)->nullable()->after('address')->comment('عرض جغرافیایی');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude')->comment('طول جغرافیایی');
            
            // Priority and incident info
            $table->string('priority', 10)->nullable()->after('longitude')->comment('سطح اولویت');
            $table->integer('victims')->nullable()->after('priority')->comment('تعداد مجروحان');
            $table->datetime('time_of_incident')->nullable()->after('victims')->comment('زمان وقوع حادثه');
            $table->datetime('call_time_info')->nullable()->after('time_of_incident')->comment('اطلاعات زمانی تماس');
            
            // Source information
            $table->string('incident_source_location', 255)->nullable()->after('call_time_info')->comment('موقعیت منبع اعلام حادثه');
            $table->string('incident_declaration_source', 255)->nullable()->after('incident_source_location')->comment('منبع اعلام حادثه');
            $table->json('organizational_source')->nullable()->after('incident_declaration_source')->comment('نوع سازمان');
            $table->string('organizational_type', 100)->nullable()->after('organizational_source')->comment('نوع (درون جمعیت/برون جمعیت)');
            $table->string('public_source', 255)->nullable()->after('organizational_type')->comment('نوع منبع مردمی');
            $table->string('relative_type_detail', 100)->nullable()->after('public_source')->comment('نوع خویشاوندی');
            
            // Incident statistics
            $table->integer('number_of_injured')->nullable()->after('relative_type_detail')->comment('تعداد افراد حادثه دیده');
            $table->integer('number_of_vehicles')->nullable()->after('number_of_injured')->comment('تعداد خودروهای درگیر');
            $table->integer('number_of_trapped')->nullable()->after('number_of_vehicles')->comment('تعداد افراد محبوس شده');
            $table->integer('number_of_houses')->nullable()->after('number_of_trapped')->comment('تعداد منازل درگیر');
            
            // Additional information
            $table->string('main_complaint', 500)->nullable()->after('number_of_houses')->comment('شکایت اصلی');
            $table->string('cooperating_organizations', 500)->nullable()->after('main_complaint')->comment('ارگانهای همکار');
            $table->json('victims_list')->nullable()->after('cooperating_organizations')->comment('لیست حادثه دیدگان');
            
            // Mission cancellation fields
            $table->text('mission_cancel_reason')->nullable()->after('victims_list')->comment('دلیل لغو مأموریت');
            $table->string('cancel_source', 100)->nullable()->after('mission_cancel_reason')->comment('منبع لغو کننده');
            $table->string('cancel_phone_number', 15)->nullable()->after('cancel_source')->comment('شماره تماس منبع لغو کننده');
            $table->string('cancel_public_source', 100)->nullable()->after('cancel_phone_number')->comment('نوع منبع مردمی لغو کننده');
            $table->string('cancel_relative_type', 100)->nullable()->after('cancel_public_source')->comment('نوع خویشاوندی لغو کننده');
            $table->json('cancel_organizational_source')->nullable()->after('cancel_relative_type')->comment('نوع سازمان لغو کننده');
            $table->string('cancel_organizational_type', 100)->nullable()->after('cancel_organizational_source')->comment('نوع سازمان لغو کننده');
            
            // Mission result fields
            $table->text('mission_result')->nullable()->after('cancel_organizational_type')->comment('نتیجه مأموریت');
            $table->string('call_track_detail', 15)->nullable()->after('mission_result')->comment('شماره تماس پیگیری تفصیلی');
            $table->string('call_track_name', 200)->nullable()->after('call_track_detail')->comment('نام و نام خانوادگی پیگیری کننده');
            $table->string('follow_up_type', 200)->nullable()->after('call_track_name')->comment('نوع پیگیری');
            
            // Nuisance type
            $table->string('nuisance_type', 100)->nullable()->after('follow_up_type')->comment('نوع مزاحمت');
            
            // Operational fields
            $table->json('operational_teams')->nullable()->after('nuisance_type')->comment('نوع تیم عملیاتی مورد نیاز');
            $table->json('mission_types')->nullable()->after('operational_teams')->comment('نوع مأموریت تیم عملیاتی');
            $table->json('required_vehicles')->nullable()->after('mission_types')->comment('نوع خودرو مورد نیاز');
            $table->boolean('needs_other_provinces')->nullable()->after('required_vehicles')->comment('نیازمند حضور سایر استان ها');
            
            // Additional fields
            $table->string('cc', 500)->nullable()->after('needs_other_provinces')->comment('شکایت اصلی');
            $table->string('trapped_in_flood_snow_num_detail', 10)->nullable()->after('cc')->comment('تعداد افراد گرفتار شده در سیل / برف تفصیلی');
            $table->json('organizations_in_place_detail')->nullable()->after('trapped_in_flood_snow_num_detail')->comment('ارگانهای در محل تفصیلی');
        });
    }

    public function down(): void
    {
        Schema::table('contact_details', function (Blueprint $table) {
            $table->dropColumn([
                'contact_type', 'caller_first_name', 'caller_last_name', 'caller_age',
                'address', 'latitude', 'longitude', 'priority', 'victims', 'time_of_incident', 'call_time_info',
                'incident_source_location', 'incident_declaration_source', 'organizational_source', 'organizational_type',
                'public_source', 'relative_type_detail', 'number_of_injured', 'number_of_vehicles', 'number_of_trapped', 'number_of_houses',
                'main_complaint', 'cooperating_organizations', 'victims_list',
                'mission_cancel_reason', 'cancel_source', 'cancel_phone_number', 'cancel_public_source', 'cancel_relative_type',
                'cancel_organizational_source', 'cancel_organizational_type',
                'mission_result', 'call_track_detail', 'call_track_name', 'follow_up_type', 'nuisance_type',
                'operational_teams', 'mission_types', 'required_vehicles', 'needs_other_provinces',
                'cc', 'trapped_in_flood_snow_num_detail', 'organizations_in_place_detail'
            ]);
            
            $table->text('address')->nullable(false)->change();
        });
    }
};