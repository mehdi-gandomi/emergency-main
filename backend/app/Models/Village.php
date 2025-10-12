<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Village extends Model
{
    protected $table = 'villages';
    public $timestamps = false;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int'; // int unsigned

    protected $fillable = [
        'id',                 // کد
        'OBJECTID',
        'Abadi_Code',
        'ADRES1395',
        'title',              // عنوان
        'province_id',        // کد استان
        'city_id',            // کد شهرستان
        'rural_district_id',  // کد دهستان
        'lon_old',            // طول جغرافیایی قدیم
        'lat_old',            // عرض جغرافیایی قدیم
        'lat','lon',
        'state',              // وضعیت
        'ostan',              // نام استان
        'OstanCode',          // کد استان
        'city',               // نام شهرستان
        'ShahrestanCode',     // کد شهرستان
        'bakhsh',             // نام بخش
        'BakhshCode',         // کد بخش
        'dehestan',           // نام شهر/دهستان
        'ShrDeh',             // کد شهر/دهستان
        'Hozeh',              // کد حوزه
        'BlkAbdName',         // نام آبادی
        'BlkAbd',             // کد آبادی
        'jam','men','women','khanevar', // جمعیت
        'update_ids',
        'va_phone','va_mobile','va_name',
        'council_phone1','council_phone2','council_phone3',
        'inter_cres',
        'txt',
        'radius','center','type',
        'width','length','height',
        'village_id',
    ];

    protected $casts = [
        'province_id'       => 'integer',
        'city_id'           => 'integer',
        'rural_district_id' => 'integer',
        'lon_old'           => 'float',
        'lat_old'           => 'float',
        'lat'               => 'float',
        'lon'               => 'float',
        'state'             => 'integer',
        'Hozeh'             => 'integer',
        'update_ids'        => 'integer',
        'radius'            => 'integer',
        'center'            => 'integer',
        'type'              => 'integer',
        'village_id'        => 'integer',
    ];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    public function cityRef(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }
}
