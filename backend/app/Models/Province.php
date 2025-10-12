<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    protected $table = 'provinces';
    public $timestamps = false;
    protected $primaryKey = 'id';
    public $incrementing = false; // چون در DDL اتواینکریمنت نیامده
    protected $keyType = 'int';

    protected $fillable = [
        'id',                // کد
        'province_id1',      // کد دو رقمی استان
        'title',             // عنوان
        'ip',                // استفاده جهت مرتب‌سازی
        'type',              // نوع
        'area_code',         // کد تلفن
        'hf_address',        // کد خطاب HF
        'server_ip',         // ip سرور 112 استان
        'state',             // وضعیت
        'serial',            // سریال
        'show_dmis',         // نمایش داخل dmis
        'show_pay',          // نمایش پرداخت
    ];

    protected $casts = [
        'ip'        => 'integer',
        'type'      => 'integer',
        'state'     => 'integer',
        'serial'    => 'integer',
        'show_dmis' => 'integer',
        'show_pay'  => 'integer',
    ];

    public function cities(): HasMany
    {
        return $this->hasMany(City::class, 'province_id', 'id');
    }

    public function operators(): HasMany
    {
        return $this->hasMany(Operator::class, 'province_id', 'id');
    }

    public function operationalCenters(): HasMany
    {
        return $this->hasMany(OperationalCenter::class, 'province_id', 'id');
    }
}
