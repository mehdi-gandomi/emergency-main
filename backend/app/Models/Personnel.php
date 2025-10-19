<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Personnel extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'personnel';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'town_id',           // کد شهر
        'city_id',
        'city_id_old',
        'name',              // نام
        'family',            // نام خانوادگي
        'cooperation_id',    // نوع کاربری
        'personnel_num',     // کد پرسنلي
        'national_code',     // کد ملي
        'certificate_number', // شماره شناسنامه
        'father_name',       // نام پدر
        'sex',               // جنسيت
        'registrar_id',      // کد ثبت کننده
        'personnel_img',     // عکس پرسنلي 1 – آپلود0 - عدم آپلود
        'employment_kind_id', // کد نوع استخدامي
        'office_post_id',    // کد پست در اداره
        'place_code',
        'job_id',            // کد سمت
        'state',             // وضعيت 1 – فعال0 - غيرفعال
        'job_rank_id',       // کد رتبه شغلی
        'job_type_id',       // کد نوع شغل
        'department_id',     // کد دستگاه اجرایی
        'work_range',        // محدوده کاری
        'user_in',           // کاربر(سازمان، دستگاه اجرایی ملی،استانداری، ...)
        'post_id',
    ];

    /**
     * Get all status records for this personnel.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function statusRecords(): HasMany
    {
        return $this->hasMany(RecordPersonsStatus::class, 'personnel_id', 'id');
    }
}
