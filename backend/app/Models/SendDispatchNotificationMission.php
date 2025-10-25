<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SendDispatchNotificationMission extends Model
{
    protected $table = 'send_dispatch_notification_mission';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'province_id_user',     // کد استان فردی که نوتیفیکیشن را ارسال کرده است
        'personnel_id_user',    // کد پرسنلی فردی که نوتیفیکیشن را ارسال کرده است
        'personnel_id',         // کد پرسنلی فرد اعزام‌شده
        'operational_centers_id', // کد مرکز عملیاتی فراخوان‌شده
        'IMEI',                 // شماره IMEI گوشی
        'events_id',            // کد حادثه
        'initial_report_id',    // کد حادثه در فرم گزارش اولیه
        'time_send',            // زمان ارسال نوتیفیکیشن حادثه به گوشی
        'time_seen',            // زمان مشاهده نوتیفیکیشن
        'time_confirmation',    // زمان تأیید یا عدم تأیید
        'comm',                 // متن ارسالی به گوشی
        'state',                // وضعیت: -1=نمایش داده نشده، 0=ارسال شده، 1=تأیید، 2=مشاهده، 3=عدم مشاهده، 4=عدم تأیید
    ];

    // ارتباط با پرسنل ارسال‌کننده نوتیفیکیشن
    public function senderPersonnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id_user', 'id');
    }

    // ارتباط با پرسنل اعزام‌شده
    public function dispatchedPersonnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id', 'id');
    }

    // در صورت وجود مدل Event
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'events_id', 'id');
    }
}
