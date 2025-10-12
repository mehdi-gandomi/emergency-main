<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OperationalSupportHome extends Model
{
    protected $table = 'operational_support_homes';
    public $timestamps = false;

    protected $primaryKey = 'id';
    public $incrementing = false; // در DDL اتواینکریمنت ذکر نشده
    protected $keyType = 'int';

    protected $fillable = [
        'id',                 // کد مرکز پشتیبان عملیات
        'province_id',        // استان
        'branches_id',        // شعبه
        'city_id',            // شهرستان
        'section_id',         // بخش
        'area_type',          // نوع منطقه(0:شهری،1:روستایی)
        'town_id',            // شهر
        'district',           // محله
        'rural_district_id',  // دهستان
        'village_id',         // روستا (رشته؛ امکان ثبت چند شناسه)
        'title',              // نام مرکز پشتیبان عملیاتی
        'three_digit_code',   // کد مرکز پشتیبان عملیاتی
        'fixed_number',       // شماره ثابت
        'fax',                // شماره فکس
        'mobile',             // شماره همراه
        'lon',                // طول جغرافیایی(E)
        'lat',                // عرض جغرافیایی(N)
        'length',             // طول جغرافیایی(E)
        'width',              // عرض جغرافیایی(N)
        'height',             // ارتفاع
        'img_header',         // تصویر سر درب
        'img_building',       // تصویر ساختمان
        'address',            // آدرس پستی
        'description',        // توضیحات
        'postal_code',        // کد پستی
        'fullname',           // نام و نام خانوادگی مسئول خانه هلال
        'national_code',      // کد ملی
        'status',             // وضعیت
        'status_emis',        // وضعیت سامانه emis
        'status_equipment',   // وضعیت سامانه تجهیزات
        'status_dims',        // وضعیت سامانه dmis
        'status_air_relief',  // وضعیت سامانه امداد هوایی
        'status_memberrcs',   // وضعیت سامانه ساجد
        'status_emdadyar',    // وضعیت سامانه امدادگران
        'status_webgis',      // وضعیت webgis
        'coding',             // کدینگ
    ];

    protected $casts = [
        'province_id'        => 'integer',
        'branches_id'        => 'integer',
        'city_id'            => 'integer',
        'section_id'         => 'integer',
        'area_type'          => 'integer',
        'town_id'            => 'integer',
        'rural_district_id'  => 'integer',
        'lon'                => 'float',
        'lat'                => 'float',
        'status'             => 'integer',
        'status_emis'        => 'integer',
        'status_equipment'   => 'integer',
        'status_dims'        => 'integer',
        'status_air_relief'  => 'integer',
        'status_memberrcs'   => 'integer',
        'status_emdadyar'    => 'integer',
        'status_webgis'      => 'integer',
    ];

    // روابط
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    // شعبه (مرجع: city.id)
    public function branch(): BelongsTo
    {
        return $this->belongsTo(City::class, 'branches_id', 'id');
    }

    // شهرستان (مرجع: city.id)
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }

    // شهر (مرجع: town.id)
    public function town(): BelongsTo
    {
        return $this->belongsTo(Town::class, 'town_id', 'id');
    }

    // نکته: village_id در DDL رشته است (احتمالاً چند مقدار). به‌همین دلیل رابطه مستقیم Eloquent تعریف نشده.
}
