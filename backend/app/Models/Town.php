<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Town extends Model
{
    protected $table = 'towns';
    public $timestamps = false;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int'; // smallint

    protected $fillable = [
        'id',                // کد
        'OBJECTID',
        'town_id_old',       // کد قدیم شهر
        'title',             // نام شهر/دهستان
        'province_id',       // استان
        'city_id',           // شهرستان
        'lat',               // عرض جغرافیایی
        'lon',               // طول جغرافیایی
        'section_id',        // بخش
        'A','B','C','D','E','F','code','I','J','K','L','M','N','O','P','Q',
        'town_code',         // کد شهر مادر
        'S',                 // شهر منطقه‌بندی‌شده
        'jam','men','women','khanevar', // جمعیت‌ها
        'height','width','length',
        'center',            // مرکزی
        'governor_name','governor_mobile','governor_phone',
        'mayor_name','mayor_mobile','mayor_phone',
        'txt',
        'type',              // نوع
        'state',             // وضعیت
        'branch_phone',
        'radius',
        'council_phone',
        'address',
        'town_id',           // کد شهر برای موارد خاص
        'sub_town_id',       // زیرمجموعه شهر
    ];

    protected $casts = [
        'town_id_old'  => 'integer',
        'province_id'  => 'integer',
        'city_id'      => 'integer',
        'section_id'   => 'integer',
        'center'       => 'integer',
        'type'         => 'integer',
        'state'        => 'integer',
        'radius'       => 'integer',
        'town_id'      => 'integer',
        'sub_town_id'  => 'integer',
    ];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }
}
