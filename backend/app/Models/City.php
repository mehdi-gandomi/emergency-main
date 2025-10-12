<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class City extends Model
{
    protected $table = 'cities';
    public $timestamps = false;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int'; // smallint unsigned

    protected $fillable = [
        'id',                     // کد شعبه
        'province_id',            // استان
        'branch_type',            // نوع شعبه
        'parent_branch_id',       // شعبه والد
        'title',                  // نام شعبه
        'two_digit_code_old',     // کد دو رقمی قدیم
        'two_digit_code',         // کد دو رقمی
        'date_establishment',     // تاریخ تأسیس
        'phone',                  // شماره تماس
        'fax',                    // شماره فکس
        'vhf_address',            // کد خطاب VHF
        'hf_address',             // کد خطاب HF
        'vhf_channel',            // کانال VHF
        'lon',                    // طول جغرافیایی(E)
        'lat',                    // عرض جغرافیایی(N)
        'length',                 // طول جغرافیایی(E)
        'width',                  // عرض جغرافیایی(N)
        'height',                 // ارتفاع
        'img_header',             // تصویر سردرب
        'img_building',           // تصویر ساختمان
        'bfile1',
        'bfile2',
        'address',                // آدرس
        'description',            // توضیحات
        'postal_code',            // کد پستی
        'status',                 // وضعیت
        'status_emis',            // وضعیت emis
        'status_equipment',       // وضعیت تجهیزات
        'status_dims',            // وضعیت dmis
        'status_air_relief',      // وضعیت امداد هوایی
        'status_memberrcs',       // وضعیت ساجد
        'status_emdadyar',        // وضعیت امدادگران
        'status_webgis',          // وضعیت webgis
        'coding_old',             // کدینگ
        'coding',                 // کدینگ
        'raromis_id',
        'member_id',
        'closed_thursday',        // پنجشنبه تعطیل؟
        'date_closed_thursday',   // تاریخ اعمال
        'date_closed_thursday_end',
        'emdadyar_id',
        'city_id',                // کد جدول city (ارجاع بیرونی)
        'type',                   // نوع ستادی
        'center',                 // نوع مرکزی
        'full_name_governor',     // فرماندار
        'phone_governor',         // تلفن فرماندار
    ];

    protected $casts = [
        'province_id'          => 'integer',
        'branch_type'          => 'integer',
        'parent_branch_id'     => 'integer',
        'lon'                  => 'float',
        'lat'                  => 'float',
        'status'               => 'integer',
        'status_emis'          => 'integer',
        'status_equipment'     => 'integer',
        'status_dims'          => 'integer',
        'status_air_relief'    => 'integer',
        'status_memberrcs'     => 'integer',
        'status_emdadyar'      => 'integer',
        'status_webgis'        => 'integer',
        'raromis_id'           => 'integer',
        'member_id'            => 'integer',
        'closed_thursday'      => 'integer',
        'emdadyar_id'          => 'integer',
        'city_id'              => 'integer',
        'type'                 => 'integer',
        'center'               => 'integer',
    ];

    public function province(): BelongsTo
    {
        // توجه: در DB اصلی، نوع province_id در city با province.id سازگار نیست
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    public function operators(): HasMany
    {
        return $this->hasMany(Operator::class, 'city_id', 'id');
    }

    public function operationalCenters(): HasMany
    {
        return $this->hasMany(OperationalCenter::class, 'branches_id', 'id');
    }

    public function towns(): HasMany
    {
        return $this->hasMany(Town::class, 'city_id', 'id');
    }

    public function villages(): HasMany
    {
        return $this->hasMany(Village::class, 'city_id', 'id');
    }
}
