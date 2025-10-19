export interface IncidentFormData {
  // Contact.php mapped fields
  id?: number;                    // کد
  operator_id?: number;           // کد اپراتور
  province_id?: string;           // کد استان ثبت کننده
  city_id?: string;
  town_id?: string;
  village_id?: string;
  phone_in?: string;              // تلفن داخلی اپراتور
  date_call?: string;             // تاریخ تماس
  time_call?: string;             // ساعت تماس
  mobile: string;                 // شماره تماس گیرنده
  type_call?: string|number;             // نوع تماس
  type_report?: string;           // نوع گزارش(عملیات1،خدمات2)
  report_event?: number;     // نوع حادثه اعلامی
  device?: string;                // نام دستگاه
  mission_cancel_reason: string; // دلیل لغو مأموریت
  cancel_source: string; // منبع لغو کننده
  call_track: string; // شماره تماس پیگیری کننده
  call_track_name: string; // نام و نام خانوادگی پیگیری کننده
  mission_result: string; // نتیجه مأموریت
  cancel_phone_number?: string;   // شماره تماس منبع لغو کننده
  cancel_public_source?: string;  // نوع منبع مردمی لغو کننده
  cancel_relative_type?: string;  // نوع خویشاوندی لغو کننده
  cancel_organizational_source?: string[]; // نوع سازمان لغو کننده
  cancel_organizational_type?: string; // نوع سازمان لغو کننده
  event_details?: string;  // درحال انجام/پایان عملیات
  event_follow_id?: number;       // نمایش اطلاعات حادثه(پیگیری حادثه اعلامی)
  follow_up_type?: string;           // نوع پیگیری
  event_repetitive_id?: number;   // نمایش اطلاعات حادثه(تکراری)
  text?: string;                  // شرح مختصر حادثه  
  alarm?: string;          // آلارم
  created_personnel_id?: number;  // شخص ثبت کننده
  created_at?: string;            // زمان ثبت
  nuisance_type?: string;         // نوع مزاحمت
  caught_homes_num?: string;      // تعداد منازل درگیر  
  caught_in_snow_flood_num?: string; // تعداد افراد گرفتار شده در سیل / برف 
  prisoners_num?: string;         // تعداد افراد محبوس شده
  organizations_in_place?: string[]; // ارگانهای در محل
  // Additional UI fields - now using snake_case to match database
  caller_name: string;      // نام تماس گیرنده
  caller_lastname: string;       // نام خانوادگی تماس گیرنده
  location: string;               // موقعیت مکانی
  latitude: string;               // عرض جغرافیایی
  longitude: string;              // طول جغرافیایی
  priority: string;               // سطح اولویت
  car_num: string|number;                // تعداد خودروهای درگیر
  injured_num: string|number;            // تعداد مجروحان
  cc: string;                // شکایت اصلی
  time_of_incident: string;       // زمان وقوع حادثه
  event_date?: string;             // تاریخ احتمالی وقوع حادثه
  event_time?: string;             // ساعت احتمالی وقوع حادثه
  contact_type: string;           // نوع تماس (اضطراری/غیراضطراری/مزاحم/ناتمام)
  call_time_info?: string;        // اطلاعات زمانی تماس
  incident_source_location: number;       // موقعیت منبع اعلام حادثه
  incident_declaration_source: number;    // منبع اعلام حادثه سازمانی/مردمی
  organizational_source: string[];        // نوع سازمان
  organizational_type?: string;           // نوع (درون جمعیت/برون جمعیت)
  public_source: number;                  // نوع منبع مردمی
  relative_type: number;                  // نوع خویشاوندی
  event_people_num: string;               // تعداد قربانیان
  
  // Fields from contact_details table
  height?: string;                // ارتفاع
  width?: string;                 // عرض جغرافیایی (دیگر)
  length?: string;                // طول جغرافیایی (دیگر)
  main_street?: string;           // خیابان اصلی
  sub_street?: string;            // خیابان فرعی
  address?: string;               // آدرس
  event_environment?: string; // محیط حادثه
  event_environment_name?: string; // نام محیط حادثه
  type_mountain?: string;         // نوع کوهستان
  climb_route?: string;           // مسیر صعود
  climb_route_direction?: string; // جهت مسیر صعود
  event_place?: string;           // محل حادثه
  event_place_name?: string;      // نام محل حادثه
  axis_name?: string;             // نام محور
  city_start_id?: string;         // شهر مبدا
  city_end_id?: string;           // شهر مقصد
  km_axis?: string;               // کیلومتر محور
  nech_name?: string;             // نام گردنه
  parish_name?: string;           // نام محله
  plaque?: string;                // پلاک
  fgh_name?: string;              // نام کارخانه/باغ/منزل مسکونی
  feet_num?: string|number;       // تعداد فوتی
  healthy_people_num?: string|number; // تعداد افراد سالم
  trauma_type?: string;           // نوع تروما یا مصدومیت
  trauma_member?: string;         // عضو دچار تروما شده
  ratio?: string;                 // نسبت با فرد حادثه دیده
  operator_date?: string;         // تاریخ ارجاع به اپراتور دیسپچ
  operator_time?: string;         // ساعت ارجاع به اپراتور دیسپچ
  
  main_complaint: string;                 // شکایت اصلی
  cooperating_organizations: string[];    // ارگانهای همکار
  
  trapped_in_flood_snow_num: string;      // تعداد افراد گرفتار شده در سیل / برف
  victims_list: VictimInfo[];             // لیست حادثه دیدگان
   // Operational recommendations
   operational_teams: OperationalTeam[];       // نوع تیم عملیاتی مورد نیاز
   mission_types: string[];                    // نوع مأموریت تیم عملیاتی
   required_vehicles: RequiredVehicle[];       // نوع خودرو مورد نیاز
   needs_other_provinces: boolean;             // نیازمند حضور سایر استان ها
   mission_notes: string;  //ملاحظات ماموریت
}

export interface VictimInfo {
  id: number;
  first_name: string;      // نام
  last_name: string;       // نام خانوادگی
  gender: string;          // جنسیت
  age: string;             // سن
  contact_number: string;  // شماره تماس
  nationality: string;     // ملیت
  national_id: string;     // کد ملی/پاسپورت
}

export type ContactType = '1' | '2' | '3' | '4';
export type CallType = '1' | '2' | '4' | '5' | '6' | '8' | '9';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
export type NuisanceType = 'فحاشی' | 'سرگرمی و بازی' | 'عدم مکالمه' | 'تست شماره اضطراری';
export type IncidentSourceLocation = 'حاضر در محل' | 'خارج شده از محل' | 'عدم حضور در صحنه';
export type IncidentDeclarationSource = 'سازمانی' | 'مردمی';
export type PublicSourceType = 'خود فرد حادثه دیده' | 'عبوری حاضر در صحنه' | 'عبوری خارج شده از صحنه' | 'خویشاوندان';
export type RelativeType = 'والدین' | 'همسر' | 'فرزند' | 'دوستان' | 'برادر' | 'خواهر';

export type MissionCancelReason =
  | 'TRANSFER_BY_OTHER_ORGS'
  | 'TRANSFER_BY_PUBLIC'
  | 'RESPONDED_BY_OPERATIONAL_TEAM'
  | 'FALSE_INCIDENT'
  | 'RELEASED_BY_PUBLIC'
  | 'CALLER_SATISFIED_NO_PRESENCE'
  | 'VEHICLE_MALFUNCTION'
  | 'NEW_MISSION_ASSIGNED'
  | 'TEMPORARY_ROADBLOCK';

export const MISSION_CANCEL_REASONS: { value: MissionCancelReason; label: string; emoji?: string }[] = [
  { value: 'TRANSFER_BY_OTHER_ORGS', label: 'انتقال مصدوم توسط سایر ارگان ها', emoji: '🚑' },
  { value: 'TRANSFER_BY_PUBLIC', label: 'انتقال مصدوم توسط مردمی', emoji: '👥' },
  { value: 'RESPONDED_BY_OPERATIONAL_TEAM', label: 'پاسخگویی به حادثه توسط تیم عملیاتی عامل - سایر تیم های عملیاتی', emoji: '🚨' },
  { value: 'FALSE_INCIDENT', label: 'حادثه کذب', emoji: '❌' },
  { value: 'RELEASED_BY_PUBLIC', label: 'رهاسازی مصدوم توسط مردمی', emoji: '🆘' },
  { value: 'CALLER_SATISFIED_NO_PRESENCE', label: 'رضایت فرد تماس گیرنده نسبت به عدم حضور تیم عملیاتی', emoji: '✅' },
  { value: 'VEHICLE_MALFUNCTION', label: 'نقص فنی خودرو تیم عملیاتی', emoji: '🔧' },
  { value: 'NEW_MISSION_ASSIGNED', label: 'ابلاغ ماموریت جدید', emoji: '📋' },
  { value: 'TEMPORARY_ROADBLOCK', label: 'انسداد موقت مسیر', emoji: '🚧' },
];

export const ORGANIZATIONAL_SOURCES = [
  { value: "اورژانس", label: "🚑 اورژانس" },
  { value: "نیروی انتظامی", label: "🚔 نیروی انتظامی" },
  { value: "آتش نشانی", label: "🔥 آتش نشانی" },
  { value: "پلیس راه", label: "🛣️ پلیس راه" },
  { value: "راهداری", label: "🛣️ راهداری" },
  { value: "فرمانداری", label: "🏛️ فرمانداری" },
  { value: "مدیریت بحران", label: "⚠️ مدیریت بحران" },
  { value: "کد عملیاتی", label: "🔢 کد عملیاتی" },
  { value: "عوامل ستادی و شعب سازمان امدادونجات", label: "🏢 عوامل ستادی و شعب سازمان امدادونجات" },
  { value: "EOC استان معین", label: "🏢 EOC استان معین" },
  { value: "فدراسیون های ورزشی", label: "⚽ فدراسیون های ورزشی" },
  { value: "سایر", label: "❓ سایر" }
] as const;

export const DEVICE_OPTIONS = [
  { value: "7", label: "امدادخودرو" },
  { value: "8", label: "راهداری" },
  { value: "9", label: "بهزیستی" },
  { value: "0", label: "آب" },
  { value: "1", label: "برق" },
  { value: "2", label: "گاز" },
  { value: "3", label: "110" },
  { value: "4", label: "115" },
  { value: "5", label: "120" },
  { value: "6", label: "125" },
  { value: "10", label: "118" }
] as const;

export const COOPERATING_ORGANIZATIONS = [
  { value: "اورژانس", label: "🚑 اورژانس" },
  { value: "نیروی انتظامی", label: "🚔 نیروی انتظامی" },
  { value: "آتش نشانی", label: "🔥 آتش نشانی" },
  { value: "پلیس راه", label: "🛣️ پلیس راه" },
  { value: "راهداری", label: "🛣️ راهداری" },
  { value: "فرمانداری", label: "🏛️ فرمانداری" },
  { value: "مدیریت بحران", label: "⚠️ مدیریت بحران" },
  { value: "سازمان امدادونجات", label: "🏢 سازمان امدادونجات" },
  { value: "هلال احمر", label: "🔴 هلال احمر" },
  { value: "سایر", label: "❓ سایر" }
] as const;
export interface OperationalTeam {
  type: string;
  count: number;
}

export interface RequiredVehicle {
  type: string;
  count: number;
}

export const OPERATIONAL_TEAM_TYPES = [
  { value: "بین شهری", label: "🚗 بین شهری" },
  { value: "فوریت درمانی", label: "🚑 فوریت درمانی" },
  { value: "کوهستان", label: "⛰️ کوهستان" },
  { value: "محیط های آبی و سیلاب", label: "🌊 محیط های آبی و سیلاب" },
  { value: "آوار", label: "🏚️ آوار" },
  { value: "واکنش سریع", label: "⚡ واکنش سریع" },
  { value: "توانا", label: "💪 توانا" },
  { value: "آنست", label: "🔧 آنست" },
  { value: "اسکان اضطراری و ارتباطات رادیویی", label: "📡 اسکان اضطراری و ارتباطات رادیویی" }
] as const;

export const MISSION_TYPES = [
  { value: "انتقال مصدوم", label: "🚑 انتقال مصدوم" },
  { value: "نجات فنی", label: "🔧 نجات فنی" },
  { value: "رهاسازی", label: "🆘 رهاسازی" },
  { value: "جستجو", label: "🔍 جستجو" },
  { value: "ارزیابی", label: "📋 ارزیابی" },
  { value: "رهاسازی خودرو از برف و کولاک", label: "❄️ رهاسازی خودرو از برف و کولاک" },
  { value: "رهاسازی خودرو از سیلاب", label: "🌊 رهاسازی خودرو از سیلاب" },
  { value: "ایمن سازی صحنه حادثه", label: "⚠️ ایمن سازی صحنه حادثه" },
  { value: "تخلیه آب", label: "💧 تخلیه آب" },
  { value: "انتقال به اماکن امن", label: "🏠 انتقال به اماکن امن" },
  { value: "توزیع اقلام امدادی", label: "📦 توزیع اقلام امدادی" },
  { value: "انتقال جسد", label: "⚰️ انتقال جسد" },
  { value: "اطفای حریق", label: "🔥 اطفای حریق" },
  { value: "ارسال اقلام امدادی", label: "📮 ارسال اقلام امدادی" },
  { value: "اسکان اضطراری", label: "🏕️ اسکان اضطراری" }
] as const;

export const VEHICLE_TYPES = [
  { value: "آمبولانس", label: "🚑 آمبولانس" },
  { value: "خودروی نجات", label: "🚒 خودروی نجات" },
  { value: "خودروی کمکدار", label: "🚙 خودروی کمکدار" },
  { value: "قایق نجات", label: "⛵ قایق نجات" },
  { value: "موتورلانس", label: "🏍️ موتورلانس" },
  { value: "بالگرد", label: "🚁 بالگرد" },
  { value: "اتوبوس آمبولانس", label: "🚌 اتوبوس آمبولانس" },
  { value: "خودروی ارتباطات", label: "📡 خودروی ارتباطات" },
  { value: "کرافتر", label: "🚐 کرافتر" },
  { value: "آرگو", label: "🚜 آرگو" }
] as const;