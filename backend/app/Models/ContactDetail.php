<?php
// app/Models/ContactDetail.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Enums\ContactDetails\EventEnvironment;
use App\Enums\ContactDetails\TypeMountain;
use App\Enums\ContactDetails\ClimbRoute;
use App\Enums\ContactDetails\ClimbRouteDirection;
use App\Enums\ContactDetails\RelationRatio;
use App\Enums\IncidentSourceLocation;

class ContactDetail extends Model
{
    protected $table = 'contact_details';
    public $timestamps = false;

    protected $primaryKey = 'id';
    protected $keyType = 'int';

    protected $fillable = [
        'id',                 // کد
        'contact_id',         // کد اطلاعات تماس
        'province_id',        // استان
        'city_id',            // شهرستان
        'city_id_old',
        'town_id',            // شهر
        'village_id',         // روستا
        'lon',                // طول جغرافیایی
        'lat',                // عرض جغرافیایی
        'height',             // ارتفاع
        'width',              // عرض جغرافیایی
        'length',             // طول جغرافیایی
        'main_street',        // خیابان اصلی
        'sub_street',         // خیابان فرعی
        'address',            // آدرس
        'event_environment',  // محیط حادثه
        'event_environment_name', // نام محیط حادثه
        'type_mountain',      // نوع کوهستان
        'climb_route',        // مسیر صعود
        'climb_route_direction', // جهت مسیر صعود
        'event_place',        // محل حادثه
        'event_place_name',   // نام محل حادثه
        'axis_name',          // نام محور
        'city_start_id',      // شهر مبدا
        'city_end_id',        // شهر مقصد
        'km_axis',            // کیلومتر محور
        'nech_name',          // نام گردنه
        'parish_name',        // نام محله
        'car_num',            // تعداد خودروی آسیب دیده
        'plaque',             // پلاک
        'fgh_name',           // نام کارخانه/باغ/منزل مسکونی
        'event_people_num',   // تعداد افراد حادثه دیده
        'injured_num',        // تعداد مصدوم
        'feet_num',           // تعداد فوتی
        'healthy_people_num', // تعداد افراد سالم
        'prisoners_num',      // تعداد محبوسین

        'trauma_type',        // نوع تروما یا مصدومیت
        'trauma_member',      // عضو دچار تروما شده
        'caller_name',        // نام و نام خانوادگی تماس گیرنده
        'call_track',         // شماره تماس پیگیری
        'ratio',              // نسبت با فرد حادثه دیده
        'event_date',         // تاریخ احتمالی وقوع حادثه
        'event_time',         // ساعت احتمالی وقوع حادثه
        'operator_date',      // تاریخ ارجاع به اپراتور دیسپچ
        'operator_time',      // ساعت ارجاع به اپراتور دیسپچ
        'user_date',          // تاریخ ارجاع به کاربر پایگاه
        'user_time',          // ساعت ارجاع به کاربر پایگاه
        'caught_in_snow_flood_num', // تعداد افراد گرفتار شده در سیل / برف
        'caught_homes_num', // تعداد خانه های گرفتار شده
        'organizations_in_place', // ارگانهای حاضر در صحنه,
        'mission_notes', //ملاحظات ماموریت
        // NEW fields for contact_details from frontend

        'address',           // توضیحات موقعیت
        'latitude',                       // عرض جغرافیایی (جدید)
        'longitude',                      // طول جغرافیایی (جدید)
        'priority',                       // اولویت
        'event_people_num',               // تعداد قربانیان

        'call_time_info',                 // اطلاعات زمانی تماس
        'incident_source_location',       // موقعیت منبع اعلام حادثه
        'incident_declaration_source',    // منبع اعلام حادثه
        'organizational_source',          // منبع سازمانی (JSON)
        'public_source',                  // منبع مردمی
        'relative_type_detail',           // جزئیات نوع خویشاوندی
        'injured_num',                    // تعداد مجروحان
        'number_of_vehicles',             // تعداد خودروها
        'number_of_trapped',              // تعداد محبوسین
        'number_of_houses',               // تعداد خانه‌ها
        'main_complaint',                 // شکایت اصلی
        'cooperating_organizations',      // سازمان‌های همکار
        'victims_list',                   // لیست قربانیان (JSON)
        'mission_cancel_reason',          // دلیل لغو مأموریت
        'cancel_source',                  // منبع لغو کننده
        'cancel_phone_number',            // شماره تماس منبع لغو کننده
        'cancel_public_source',           // نوع منبع مردمی لغو کننده
        'cancel_relative_type',           // نوع خویشاوندی لغو کننده
        'cancel_organizational_source',   // منبع سازمانی لغو کننده (JSON)
        'cancel_organizational_type',     // نوع سازمان لغو کننده
        'cancel_incident_declaration_source',//وضعیت حضور در صحنه لغو کننده
        'mission_result',                 // نتیجه مأموریت

        'call_track_name',                // نام پیگیری کننده
        'follow_up_type',                 // نوع پیگیری
        'nuisance_type',                  // نوع مزاحمت
        'operational_teams',              // تیم‌های عملیاتی (JSON)
        'mission_types',                  // انواع مأموریت (JSON)
        'required_vehicles',              // خودروهای مورد نیاز (JSON)
        'needs_other_provinces',          // نیاز به استان‌های دیگر
        'cc',                            // کپی کاربن

        'organizations_in_place_detail',  // جزئیات ارگان‌های حاضر در صحنه (JSON)
        'call_result',                     // نتیجه تماس
        'help_triage_result', // نتیجه تریاژ نجات
        'provinces_assisting', // استان‌های همکار معین
        'cooperating_organizations_needed', // ارگان‌های مورد نیاز
    ];

    protected $casts = [
        // 'event_environment'     => EventEnvironment::class,
        // 'type_mountain'         => TypeMountain::class,
        // 'climb_route'           => ClimbRoute::class,
        // 'climb_route_direction' => ClimbRouteDirection::class,
        // 'ratio'                 => RelationRatio::class,
        'incident_source_location'=>IncidentSourceLocation::class,
        'province_id'           => 'integer',
        'city_id'               => 'integer',
        'city_id_old'           => 'integer',
        'town_id'               => 'integer',
        'village_id'            => 'integer',
        'event_place'           => 'integer',
        'city_start_id'         => 'integer',
        'city_end_id'           => 'integer',
        'event_people_num'      => 'integer',
        'injured_num'           => 'integer',
        'feet_num'              => 'integer',
        'healthy_people_num'    => 'integer',
        'prisoners_num'         => 'integer',

        'caught_homes_num'      => 'integer',
        'caught_in_snow_flood_num' => 'integer',
        'prisoners_num'         => 'integer',
        'organizations_in_place' => 'integer',
        // New field casts
        'caller_age'                      => 'integer',
        'latitude'                        => 'decimal:8',
        'longitude'                       => 'decimal:8',
        'event_people_num'                => 'integer',

'injured_num'                     => 'integer',
        'number_of_vehicles'              => 'integer',
        'number_of_trapped'               => 'integer',
        'number_of_houses'                => 'integer',
        'organizational_source'           => 'array',
        'victims_list'                    => 'array',
        'cancel_organizational_source'    => 'array',
        'operational_teams'               => 'array',
        'mission_types'                   => 'array',
        'required_vehicles'               => 'array',
        'organizations_in_place_detail'   => 'array',
        'cooperating_organizations'       => 'array',
        'needs_other_provinces'           => 'boolean',
        'provinces_assisting'             => 'array',
        'cooperating_organizations_needed' => 'array'
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'contact_id', 'id');
    }
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }
     public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }
    public function town(): BelongsTo
    {
        return $this->belongsTo(Town::class, 'town_id', 'id');
    }
        public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class, 'village_id', 'id');
    }
}
