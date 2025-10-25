<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecordPersonsStatus extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'record_persons_status';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'personnel_id', // کدپرسنلی
        'lon',          // طول جغرافیایی(E)
        'lat',          // عرض جغرافیایی (N)
        'date',
        'time',
        'IMEI',
        'status',       // وضعیت(1:آماده به خدمت 0:پایان خدمت)
    ];

    /**
     * Get the personnel that owns the status record.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function personnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id', 'id');
    }
  
    public function personnel_mobile()
    {
        return $this->hasOne(PersonnelPhone::class, 'personnel_id', 'personnel_id')->where("phone_id",3);
    }
}
