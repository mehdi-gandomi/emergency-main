import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns-jalali";
import { Calendar as CalendarIcon, Download, Loader2, X, FileType, Columns } from 'lucide-react';

const incidentColumns = [
    { id: 'incident_id', label: 'شناسه حادثه' },
    { id: 'title', label: 'عنوان' },
    { id: 'incident_type', label: 'نوع حادثه' },
    { id: 'priority', label: 'اولویت' },
    { id: 'status', label: 'وضعیت' },
    { id: 'location.address', label: 'آدرس' },
    { id: 'location.city', label: 'شهر' },
    { id: 'location.province', label: 'استان' },
    { id: 'time_reported', label: 'زمان گزارش' },
    { id: 'operator_name', label: 'اپراتور' },
    { id: 'casualties', label: 'مصدومان' },
];

export default function ExportReportModal({ isOpen, onClose, onExport, incidents, filters }) {
    const [exportType, setExportType] = useState('csv');
    const [selectedColumns, setSelectedColumns] = useState(incidentColumns.map(c => c.id));
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [isExporting, setIsExporting] = useState(false);

    const handleColumnToggle = (columnId) => {
        setSelectedColumns(prev =>
            prev.includes(columnId) ? prev.filter(id => id !== columnId) : [...prev, columnId]
        );
    };

    const handleExport = async () => {
        setIsExporting(true);
        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log({
            exportType,
            dateRange,
            selectedColumns,
            activeFilters: filters,
            recordCount: incidents.length
        });
        
        setIsExporting(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} dir="rtl">
            <DialogContent className="sm:max-w-2xl z-1000">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Download className="w-6 h-6" />
                        دریافت گزارش حوادث
                    </DialogTitle>
                    <DialogDescription>
                        تنظیمات خروجی گزارش خود را انتخاب کنید. این گزارش شامل {incidents.length} رکورد بر اساس فیلترهای فعلی شما خواهد بود.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><FileType className="w-5 h-5"/>نوع فایل خروجی</h4>
                            <Select value={exportType} onValueChange={setExportType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="csv">CSV (مقادیر جدا شده با کاما)</SelectItem>
                                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2"><CalendarIcon className="w-5 h-5"/>محدوده زمانی (اختیاری)</h4>
                             <Popover>
                                <PopoverTrigger className="popover-trigger-full">
                                  <Button variant={"outline"} className="w-full justify-start text-right font-normal">
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                    {dateRange.from ? 
                                        (dateRange.to ? `${format(dateRange.from, 'P')} - ${format(dateRange.to, 'P')}` : format(dateRange.from, 'P'))
                                        : <span>تاریخ را انتخاب کنید</span>
                                    }
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="popover-content-full p-0" align="start">
                                  <Calendar
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2"><Columns className="w-5 h-5"/>انتخاب ستون‌ها</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg border">
                            {incidentColumns.map(col => (
                                <div key={col.id} className="flex items-center gap-2">
                                    <Checkbox
                                        id={col.id}
                                        checked={selectedColumns.includes(col.id)}
                                        onCheckedChange={() => handleColumnToggle(col.id)}
                                    />
                                    <label htmlFor={col.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {col.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>انصراف</Button>
                    <Button onClick={handleExport} disabled={isExporting}>
                        {isExporting ? <Loader2 className="animate-spin ml-2 w-5 h-5" /> : <Download className="ml-2 w-5 h-5" />}
                        تایید و دریافت
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}