import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, X, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function IncidentFilters({ filters, onFilterChange, onClearFilters, incidents, onRefresh, isRefreshing, onSearch }) {
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);

  // Extract unique values from incidents for dynamic filters
  const provinces = [...new Set(incidents.map(i => i.location?.province).filter(Boolean))];
  const cities = [...new Set(incidents.map(i => i.location?.city).filter(Boolean))];
  const operators = [...new Set(incidents.map(i => i.operator_name).filter(Boolean))];

  // Cities data structure
  const citiesData = {
    'تهران': ['تهران', 'کرج', 'ورامین', 'شهریار'],
    'اصفهان': ['اصفهان', 'کاشان', 'نجف آباد', 'خمینی شهر'],
    'شیراز': ['شیراز', 'کازرون', 'مرودشت', 'جهرم'],
    'مشهد': ['مشهد', 'نیشابور', 'سبزوار', 'تربت حیدریه'],
    'تبریز': ['تبریز', 'مراغه', 'میانه', 'اهر'],
    'اهواز': ['اهواز', 'آبادان', 'خرمشهر', 'دزفول']
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '30days');

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">فیلترهای پیشرفته</h3>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearFilters}
            >
              <X className="w-4 h-4 ml-2" />
              پاک کردن همه
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            className="flex items-center gap-2"
          >
            {isAdvancedExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isAdvancedExpanded ? 'بستن فیلترها' : 'نمایش فیلترها'}
          </Button>
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 transition-all duration-300 ${
        isAdvancedExpanded ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
      }`}>
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-3.5 text-gray-400" />
          <Input
            placeholder="جستجو در حوادث..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className="pr-10 h-9"
          />
        </div>
        

        {/* Incident Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع حادثه</label>
          <Select value={filters.incidentType || 'all'} onValueChange={(value) => onFilterChange('incidentType', value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="پزشکی">🚑 اورژانس پزشکی</SelectItem>
              <SelectItem value="آتش‌سوزی">🔥 آتش‌سوزی</SelectItem>
              <SelectItem value="تصادف">🚗 تصادف رانندگی</SelectItem>
              <SelectItem value="جرم">🚔 جرم در حال وقوع</SelectItem>
              <SelectItem value="مواد خطرناک">☢️ مواد خطرناک</SelectItem>
              <SelectItem value="بلایای طبیعی">🌪️ بلایای طبیعی</SelectItem>
              <SelectItem value="سایر">❓ سایر موارد</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اولویت</label>
          <Select value={filters.priority || 'all'} onValueChange={(value) => onFilterChange('priority', value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="P1">P1 - تهدید کننده حیات</SelectItem>
              <SelectItem value="P2">P2 - اولویت بالا</SelectItem>
              <SelectItem value="P3">P3 - اولویت متوسط</SelectItem>
              <SelectItem value="P4">P4 - اولویت پایین</SelectItem>
              <SelectItem value="P5">P5 - صرفاً اطلاع‌رسانی</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
          <Select value={filters.status || 'all'} onValueChange={(value) => onFilterChange('status', value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="pending">در انتظار</SelectItem>
              <SelectItem value="assigned">ارجاع شده</SelectItem>
              <SelectItem value="in_progress">درحال عملیات</SelectItem>
              <SelectItem value="temporarily_completed">پایان موقت</SelectItem>
              <SelectItem value="completed">پایان عملیات</SelectItem>
              <SelectItem value="cancelled">لغو شده</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Operator Code 112 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کد اپراتور ۱۱۲</label>
          <Select value={filters.operatorCode || 'all'} onValueChange={(value) => onFilterChange('operatorCode', value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="OPR-1403-700">OPR-1403-700</SelectItem>
              <SelectItem value="OPR-1403-701">OPR-1403-701</SelectItem>
              <SelectItem value="OPR-1403-702">OPR-1403-702</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">استان</label>
          <Select value={filters.province || 'all'} onValueChange={(value) => {
            onFilterChange('province', value === 'all' ? '' : value);
            // Reset city when province changes
            onFilterChange('city', '');
          }}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="تهران">تهران</SelectItem>
              <SelectItem value="اصفهان">اصفهان</SelectItem>
              <SelectItem value="شیراز">شیراز</SelectItem>
              <SelectItem value="مشهد">مشهد</SelectItem>
              <SelectItem value="تبریز">تبریز</SelectItem>
              <SelectItem value="اهواز">اهواز</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شهر</label>
          <Select value={filters.city || 'all'} onValueChange={(value) => onFilterChange('city', value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              {filters.province && citiesData[filters.province] ? (
                citiesData[filters.province].map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))
              ) : (
                Object.values(citiesData).flat().map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Contact Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
          <DatePicker
            value={filters.contactDateFrom ? new Date(filters.contactDateFrom) : null}
            onChange={(date) => {
              if (date) {
                const dateObj = new Date(date);
                onFilterChange('contactDateFrom', dateObj.toISOString().split('T')[0]);
              } else {
                onFilterChange('contactDateFrom', '');
              }
            }}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            className="h-9 w-full"
            inputClass="h-9 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="انتخاب تاریخ"
          />
        </div>

        {/* Contact Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تا تاریخ</label>
          <DatePicker
            value={filters.contactDateTo ? new Date(filters.contactDateTo) : null}
            onChange={(date) => {
              if (date) {
                const dateObj = new Date(date);
                onFilterChange('contactDateTo', dateObj.toISOString().split('T')[0]);
              } else {
                onFilterChange('contactDateTo', '');
              }
            }}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            className="h-9 w-full"
            inputClass="h-9 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="انتخاب تاریخ"
          />
        </div>

        {/* Contact Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ساعت تماس</label>
          <Input
            type="time"
            value={filters.contactTime || ''}
            onChange={(e) => onFilterChange('contactTime', e.target.value)}
            className="h-9"
          />
        </div>

        {/* Contact Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نوع تماس</label>
          <Select value={filters.contactType || 'all'} onValueChange={(value) => onFilterChange('contactType', value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="call_112">تماس ۱۱۲</SelectItem>
              <SelectItem value="application">اپلیکیشن</SelectItem>
              <SelectItem value="operator_entry">ورود اپراتور</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recipient Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس گیرنده</label>
          <Input
            placeholder="شماره تماس گیرنده"
            value={filters.recipientPhone || ''}
            onChange={(e) => onFilterChange('recipientPhone', e.target.value)}
            className="h-9"
          />
        </div>

        {/* Contact Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات تماس</label>
          <Input
            placeholder="توضیحات تماس"
            value={filters.contactDescription || ''}
            onChange={(e) => onFilterChange('contactDescription', e.target.value)}
            className="h-9"
          />
        </div>

        {/* Operator Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام اپراتور</label>
          <Input
            placeholder="نام اپراتور"
            value={filters.operatorName || ''}
            onChange={(e) => onFilterChange('operatorName', e.target.value)}
            className="h-9"
          />
        </div>

        {/* Operator Internal Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تلفن داخلی اپراتور</label>
          <Input
            placeholder="تلفن داخلی"
            value={filters.operatorInternalPhone || ''}
            onChange={(e) => onFilterChange('operatorInternalPhone', e.target.value)}
            className="h-9"
          />
        </div>

        {/* User Registration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">کاربر ثبت کننده</label>
          <Select value={filters.userRegistration || 'all'} onValueChange={(value) => onFilterChange('userRegistration', value === 'all' ? '' : value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="انتخاب مورد" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="system">سیستم</SelectItem>
              <SelectItem value="operator">اپراتور</SelectItem>
              <SelectItem value="citizen">شهروند</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Creation Time From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">زمان ایجاد از</label>
          <DatePicker
            value={filters.creationTimeFrom ? new Date(filters.creationTimeFrom) : null}
            onChange={(date) => {
              if (date) {
                const dateObj = new Date(date);
                onFilterChange('creationTimeFrom', dateObj.toISOString());
              } else {
                onFilterChange('creationTimeFrom', '');
              }
            }}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD HH:mm"
            className="h-9 w-full"
            inputClass="h-9 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="انتخاب تاریخ و زمان"
          />
        </div>

        {/* Creation Time To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">زمان ایجاد تا</label>
          <DatePicker
            value={filters.creationTimeTo ? new Date(filters.creationTimeTo) : null}
            onChange={(date) => {
              if (date) {
                const dateObj = new Date(date);
                onFilterChange('creationTimeTo', dateObj.toISOString());
              } else {
                onFilterChange('creationTimeTo', '');
              }
            }}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD HH:mm"
            className="h-9 w-full"
            inputClass="h-9 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="انتخاب تاریخ و زمان"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
        <Button variant="outline" onClick={onClearFilters}>
          <X className="w-4 h-4 ml-2" />
          پاک کردن فیلترها
        </Button>
        <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <RefreshCw className="w-4 h-4 ml-2" />}
          نوسازی
        </Button>
        <Button onClick={onSearch}>
          <Search className="w-4 h-4 ml-2" />
          جستجو
        </Button>
      </div>
    </Card>
  );
}