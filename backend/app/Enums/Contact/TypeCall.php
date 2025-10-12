<?php
// app/Enums/Contact/TypeCall.php
namespace App\Enums\Contact;

enum TypeCall:int
{
    case Disturbing        = 0;  // مزاحم
    case Administrative    = 1;  // انجام امور اداری
    case IncidentFollowUp  = 2;  // پیگیری حادثه اعلامی
    case IncompleteCall    = 3;  // تماس نیمه تمام
    case RepeatedIncident  = 4;  // حادثه تکراری
    case RelatedIncident   = 5;  // حادثه مرتبط
    case UnrelatedIncident = 6;  // حادثه غیر مرتبط
    case Guidance          = 7;  // دریافت راهنمایی
}
