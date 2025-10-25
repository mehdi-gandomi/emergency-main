<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Operator extends Model
{
    protected $table = 'operator';
    public $timestamps = false;


    protected $fillable = [
        'id',             // کد
        'province_id',    // استان
        'city_id',        // شعبه
        'city_id_old',    // کد قدیم شعبه
        'type_person',    // نوع فرد(0:امدادگر-1:پرسنل)
        'member_id',      // فرد (member_id / personnel_id)
        'personnel_id',   // پرسنل
        'code_operator',  // کد اپراتور (ZEROFILL)
        'type',           // نوع اپراتور (0:112 1:دیسپچ 2:هردو)
        'state',          // وضعیت
    ];

    protected $casts = [
        'province_id'  => 'integer',
        'city_id'      => 'integer',
        'city_id_old'  => 'integer',
        'type_person'  => 'integer',
        'member_id'    => 'integer',
        'personnel_id' => 'integer',
        'code_operator'=> 'integer',
        'type'         => 'integer',
        'state'        => 'integer',
    ];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }
    public function personnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id', 'id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'id');
    }
}
