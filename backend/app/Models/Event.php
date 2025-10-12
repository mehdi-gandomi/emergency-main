<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = false;

    protected $casts = [
        'id' => 'integer',
        'num_report' => 'integer',
        'initial_report_id' => 'integer',
        'base_type' => 'integer',
        'result_person_visit' => 'integer',
        'parent_events_id' => 'integer',
        'parent_details_events_id' => 'integer',
        'weather_warnings_id' => 'integer',
        'mountain_accident_type' => 'integer',
        'environment_mountain_incident' => 'integer',
        'access_transport_injured_person' => 'integer',
        'from_height' => 'integer',
        'length_access_transfer_workshops' => 'integer',
        'total_distance_traveled_during_transportation' => 'integer',
        'aquatic_environment_type' => 'integer',
        'aquatic_environment_place' => 'integer',
        'sanitation_plan_zone' => 'integer',
        'type_report' => 'integer',
        'type_event_id' => 'integer',
        'level' => 'integer',
        'dispatch_province_id' => 'integer',
        'dispatch_branches_id' => 'integer',
        'dispatch_operational_centers_id' => 'integer',
        'contact_times_112' => 'integer',
        'times_inform_population' => 'integer',
        'times_accident' => 'integer',
        'times_notify_base' => 'integer',
        'times_inform_base' => 'integer',
        'moving_times_base' => 'integer',
        'operation_times' => 'integer',
        'times_leave_place_operation' => 'integer',
        'cancel_operations' => 'integer',
        'cancel_operation_times' => 'integer',
        'reason_cancellation_operations_id' => 'integer',
        'mission_end_times' => 'integer',
        'source_accident_announcement_id' => 'integer',
        'how_get_first_report' => 'integer',
        'province_id' => 'integer',
        'branches_id' => 'integer',
        'operational_centers_id' => 'integer',
        'backup_bases_are_present' => 'integer',
        'distance_from_nearest_base' => 'decimal:2',
        'lon' => 'float',
        'lat' => 'float',
        'height' => 'integer',
        'other_devices_present' => 'integer',
        'times_send_inform_specific_bases' => 'integer',
        'type_operation' => 'integer',
        'reasons_without_operational_action_id' => 'integer',
        'degree_importance_incident' => 'integer',
        'view_monitoring_map' => 'integer',
        'regulators' => 'integer',
        'seconder' => 'integer',
        'temporary_end_operation' => 'integer',
        'archived' => 'integer',
        'operation_status' => 'integer',
    ];

    protected $fillable = [
        // شماره گزارش
        'num_report',
        // کد حادثه در فرم گزارش اولیه
        'initial_report_id',
        // نوع پایگاه (1 پشتیبان / 0 اصلی / -1 نامشخص)
        'base_type',
        // نتیجه مراجعه حضوری
        'result_person_visit',
        // کد حادثه پدر
        'parent_events_id',
        // کد جزئیات حادثه پدر (ممیزی)
        'parent_details_events_id',
        // کد کمک بین‌الملل (GLIDE)
        'glide_number',
        // کد هشدار هواشناسی
        'weather_warnings_id',
        // نوع حادثه کوهستان
        'mountain_accident_type',
        // محیط حادثه کوهستان
        'environment_mountain_incident',
        // نحوه دسترسی و انتقال مصدوم
        'access_transport_injured_person',
        // از ارتفاع (متر)
        'from_height',
        // طول کارگاه‌های دسترسی و انتقال (متر)
        'length_access_transfer_workshops',
        // کل مسافت طی‌شده در زمان حمل (متر)
        'total_distance_traveled_during_transportation',
        // نوع محیط‌های آبی
        'aquatic_environment_type',
        // محل وقوع محیط‌های آبی
        'aquatic_environment_place',
        // محدوده طرح سالم‌سازی
        'sanitation_plan_zone',
        // نوع گزارش (1 عملیات، 2 خدمات)
        'type_report',
        // نوع حادثه
        'type_event_id',
        // شرح دقیق حادثه
        'detailed_description',
        // سطح/وسعت حادثه (-1 نامشخص، 1 محلی، 2 منطقه‌ای، 3 ملی، 4 بین‌المللی)
        'level',
        // استان محل اعزام
        'dispatch_province_id',
        // شعبه محل اعزام
        'dispatch_branches_id',
        // مرکز عملیاتی محل اعزام
        'dispatch_operational_centers_id',
        // فیلدهای زمان/تاریخ تماس و اطلاع‌رسانی (عددی/متنی)
        'contact_times_112', 'contact_date_112', 'contact_time_112',
        'times_inform_population', 'date_inform_population', 'time_inform_population',
        'times_accident', 'date_accident', 'time_accident',
        'times_notify_base', 'date_notify_base', 'time_notify_base',
        'times_inform_base', 'date_inform_base', 'time_inform_base',
        'moving_times_base', 'moving_date_base', 'moving_time_base',
        'operation_times', 'operation_date', 'operation_time',
        'times_leave_place_operation', 'date_leave_place_operation', 'time_leave_place_operation',
        // لغو عملیات و علت
        'cancel_operations', 'cancel_operation_times', 'cancel_operation_date', 'cancel_operation_time', 'reason_cancellation_operations_id',
        // پایان مأموریت
        'mission_end_times', 'mission_end_date', 'mission_end_time',
        // منبع اعلام حادثه و نحوه دریافت اولین گزارش
        'source_accident_announcement_id', 'how_get_first_report',
        // موقعیت مکانی و اداری حادثه
        'province_id', 'branches_id', 'operational_centers_id',
        // پایگاه‌های پشتیبان (1 دارد / 0 ندارد)
        'backup_bases_are_present',
        // مختصات و موقعیت
        'exact_location', 'distance_from_nearest_base', 'geographic_area',
        'lon', 'lat', 'length', 'width', 'height',
        // سایر دستگاه‌های حاضر
        'other_devices_present',
        // ارسال اطلاعات به پایگاه معین
        'times_send_inform_specific_bases', 'date_send_inform_specific_bases', 'time_send_inform_specific_bases',
        // نوع عملیات
        'type_operation',
        // بدون اقدام عملیاتی - دلیل
        'reasons_without_operational_action_id',
        // درجه اهمیت
        'degree_importance_incident',
        // نمایش روی نقشه مانیتورینگ
        'view_monitoring_map',
        // توضیحات بیشتر
        'more_details',
        // تنظیم‌کننده و تأییدکننده
        'regulators', 'seconder',
        // پایان موقت عملیات
        'temporary_end_operation',
        // توضیحات
        'description',
        // بایگانی
        'archived',
        // وضعیت عملیات (1 درحال انجام، 2 پایان موقت، 3 پایان عملیات)
        'operation_status',
    ];

    /* ---------- Query Scopes for Filters ---------- */

    public function scopeWhen(Builder $q, $value, \Closure $callback): Builder
    {
        if ($value !== null && $value !== '') {
            $callback($q, $value);
        }
        return $q;
    }

    public function scopeTypeEvent(Builder $q, $typeId): Builder
    {
        return $q->when($typeId, fn($qq, $v) => $qq->where('type_event_id', $v));
    }

    public function scopeBetweenUnix(Builder $q, ?int $from, ?int $to, string $column = 'times_accident'): Builder
    {
        return $q->when($from, fn($qq) => $qq->where($column, '>=', $from))
                 ->when($to, fn($qq) => $qq->where($column, '<=', $to));
    }

    public function scopeSearch(Builder $q, ?string $term): Builder
    {
        return $q->when($term, fn($qq) => $qq->where(function($w) use ($term) {
            $w->where('detailed_description', 'like', "%{$term}%")
              ->orWhere('more_details', 'like', "%{$term}%")
              ->orWhere('exact_location', 'like', "%{$term}%")
              ->orWhere('geographic_area', 'like', "%{$term}%");
        }));
    }

    public function scopeGeoBox(Builder $q, ?float $minLat, ?float $maxLat, ?float $minLon, ?float $maxLon): Builder
    {
        return $q->when($minLat, fn($qq)=>$qq->where('lat', '>=', $minLat))
                 ->when($maxLat, fn($qq)=>$qq->where('lat', '<=', $maxLat))
                 ->when($minLon, fn($qq)=>$qq->where('lon', '>=', $minLon))
                 ->when($maxLon, fn($qq)=>$qq->where('lon', '<=', $maxLon));
    }
}
