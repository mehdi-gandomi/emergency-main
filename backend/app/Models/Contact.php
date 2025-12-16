<?php
// app/Models/Contact.php

namespace App\Models;
use App\Enums\Contact\NuisanceType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Enums\Contact\TypeCall;
use App\Enums\Contact\TypeReport;
use App\Enums\Contact\ReportEvent;
use App\Enums\Contact\Device;
use App\Enums\Contact\EventDetailsStatus;
use App\Enums\Contact\AlarmStatus;

class Contact extends Model
{
    protected $table = 'contacts';
    

    protected $primaryKey = 'id';
    protected $keyType = 'int';

    protected $fillable = [
        'id',                  // کد
        'operator_id',         // کد اپراتور
        'province_id',         // کد استان ثبت کننده
        'city_id',             // کد شهر
        'town_id',             // کد شهرستان
        'village_id',          // کد روستا
        'phone_in',            // تلفن داخلی اپراتور
        'date_call',           // تاریخ تماس
        'time_call',           // ساعت تماس
        'mobile',              // شماره تماس گیرنده
        'type_call',           // نوع تماس
        'type_report',         // نوع گزارش(عملیات1،خدمات2)
        'report_event',        // نوع حادثه اعلامی
        'device',              // نام دستگاه
        'event_details',       // درحال انجام/پایان عملیات
        'event_follow_id',     // نمایش اطلاعات حادثه(پیگیری حادثه اعلامی)
        'event_repetitive_id', // نمایش اطلاعات حادثه(تکراری)
        'text',                // شرح مختصر حادثه
        'alarm',               // آلارم
        'created_personnel_id',// شخص ثبت کننده
        'nuisance_type',          // نوع مزاحمت
        
        // Additional fields from IncidentFormData
        'caller_name',         // نام تماس گیرنده
        'caller_lastname',     // نام خانوادگی تماس گیرنده
        'location',            // موقعیت مکانی
        'latitude',            // عرض جغرافیایی
        'longitude',           // طول جغرافیایی
        'priority',            // سطح اولویت
        'victims',             // تعداد مجروحان
        'contact_type',        // نوع تماس (اضطراری/غیراضطراری/مزاحم/ناتمام)
        // 'call_time_info',      // اطلاعات زمانی تماس
        'incident_source_location', // موقعیت منبع اعلام حادثه
        'incident_declaration_source', // منبع اعلام حادثه
        'organizational_source', // نوع سازمان (JSON array)
        'public_source',       // نوع منبع مردمی
        'relative_type',       // نوع خویشاوندی
        'number_of_injured',   // تعداد افراد حادثه دیده
        'number_of_vehicles',  // تعداد خودروهای درگیر
        'number_of_trapped',   // تعداد افراد محبوس شده
        'number_of_houses',    // تعداد منازل درگیر
        'main_complaint',      // شکایت اصلی
        'cooperating_organizations', // ارگانهای همکار
        'victims_list',        // لیست حادثه دیدگان (JSON)
    ];

    protected $casts = [
        'nuisance_type' => NuisanceType::class,
        'type_call'       => TypeCall::class,
        'type_report'     => TypeReport::class,        
        'device'          => Device::class,
        'event_details'   => EventDetailsStatus::class,
        'alarm'           => AlarmStatus::class,
        'province_id'     => 'integer',
        'operator_id'     => 'integer',
        'phone_in'        => 'integer',
        'event_follow_id' => 'integer',
        'event_repetitive_id' => 'integer',
        'created_personnel_id' => 'integer',
        
        // Date fields
        'date_call'       => 'string',
        'time_call'       => 'string',
        'time_of_incident' => 'string',
        
        // New field casts
        'city_id'         => 'integer',
        'town_id'         => 'integer', 
        'village_id'      => 'integer',
        'latitude'        => 'decimal:8',
        'longitude'       => 'decimal:8',
        'number_of_injured' => 'integer',
        'number_of_vehicles' => 'integer',
        'number_of_trapped' => 'integer',
        'number_of_houses' => 'integer',
        'organizational_source' => 'array', // JSON array
        'victims_list'    => 'array',     // JSON array
    ];

    public function details(): HasOne
    {
        return $this->hasOne(ContactDetail::class, 'contact_id', 'id');
    }
    public function event_type(): BelongsTo
    {
        return $this->belongsTo(TypeEvent::class, 'report_event', 'id');
    }
    public function event_follow(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_follow_id', 'id');
    }
    public function event_repetitive(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_repetitive_id', 'id');
    }
    public function operator(){
        return $this->belongsTo(Operator::class, 'operator_id', 'id');
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'contact_teams', 'contact_id', 'team_id')
            ->withPivot('count');
    }

    public function vehicles(): BelongsToMany
    {
        return $this->belongsToMany(Vehicle::class, 'contact_vehicles', 'contact_id', 'vehicle_id')
            ->withPivot('count');
    }
}
