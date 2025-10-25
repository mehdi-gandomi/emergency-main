<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OperationalCenter extends Model
{
    protected $table = 'operational_centers';
    public $timestamps = false;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int'; // smallint unsigned

    protected $fillable = [
        'id',                        // کد
        'province_id',               // استان
        'branches_id',               // شعبه
        'type_operational_center',   // نوع مرکز عملیاتی
        'account_type',              // نوع کاربری
        'title',                     // نام مرکز عملیاتی
        'coding_old',                // کدینگ قدیم
        'coding',                    // کدینگ
        'three_digit_code_new',      // کد مرکز عملیاتی
        'activity_days',             // روزهای فعالیت
        'date_activity_days',        // تاریخ اعمال روزهای فعالیت
        'type_ownership',            // نوع مالکیت
        'type_structure',            // نوع سازه
        'start_activity',            // آغاز فعالیت
        'end_activity',              // پایان فعالیت
        'memory_martyr',             // یادمان شهید
        'seasonal_type',             // نوع فصلی
        'occasional_id',             // عنوان مناسبتی
        'three_digit_code',          // کد مرکز عملیاتی
        'license_status',            // وضعیت مجوز
        'phone',                     // تلفن
        'fixed_number',              // شماره ثابت
        'mobile',                    // همراه
        'fax',                       // فکس
        'vhf_address',               // کد خطاب VHF
        'hf_address',                // کد خطاب HF
        'vhf_channel',               // کانال VHF
        'satellite_phone',           // تلفن ماهواره‌ای
        'lon',                       // طول جغرافیایی(E)
        'lat',                       // عرض جغرافیایی(N)
        'length',                    // طول جغرافیایی(E)
        'width',                     // عرض جغرافیایی(N)
        'height',                    // ارتفاع
        'arena',                     // عرصه
        'ayan',                      // اعیان
        'img_header',                // تصویر سر درب
        'img_license',               // تصویر مجوز
        'bfile1',
        'bfile2',
        'address',                   // آدرس پستی
        'description',               // توضیحات
        'postal_code',               // کد پستی
        'place_payment',             // محل پرداخت
        'type_personnel_emis',       // نوع فرد کشیک
        'kilometer',                 // فاصله تا شعبه
        'status',                    // وضعیت
        'status_emis',               // وضعیت emis
        'status_equipment',          // وضعیت تجهیزات
        'status_dims',               // وضعیت dmis
        'status_air_relief',         // وضعیت امداد هوایی
        'status_memberrcs',          // وضعیت ساجد
        'status_emdadyar',           // وضعیت امدادگران
        'status_webgis',             // وضعیت webgis
        'raromis_id',
        'member_id',
        'emdadyar_id',               // معادل کد امدادیار
        'update_emdadyar_id',        // کد امدادیار به‌روز شده؟
        'not_conditions',            // شروط emis (0:اعمال 1:عدم اعمال)
        'not_conditions_t',          // عدم اعمال شرط توالی emis
        'conditions_inc',            // شرط افزایش سقف شیفت emis
    ];

    protected $casts = [
        'province_id'            => 'integer',
        'branches_id'            => 'integer',
        'type_operational_center'=> 'integer',
        'account_type'           => 'integer',
        'three_digit_code_new'   => 'integer',
        'type_ownership'         => 'integer',
        'type_structure'         => 'integer',
        'seasonal_type'          => 'integer',
        'occasional_id'          => 'integer',
        'three_digit_code'       => 'integer',
        'license_status'         => 'integer',
        'lon'                    => 'float',
        'lat'                    => 'float',
        'height'                 => 'integer',
        'place_payment'          => 'integer',
        'type_personnel_emis'    => 'integer',
        'kilometer'              => 'float',
        'status'                 => 'integer',
        'status_emis'            => 'integer',
        'status_equipment'       => 'integer',
        'status_dims'            => 'integer',
        'status_air_relief'      => 'integer',
        'status_memberrcs'       => 'integer',
        'status_emdadyar'        => 'integer',
        'status_webgis'          => 'integer',
        'raromis_id'             => 'integer',
        'member_id'              => 'integer',
        'emdadyar_id'            => 'integer',
        'update_emdadyar_id'     => 'integer',
        'not_conditions'         => 'integer',
        'not_conditions_t'       => 'integer',
        'conditions_inc'         => 'integer',
    ];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'branches_id', 'id');
    }
}
