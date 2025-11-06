import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const IconDispatch = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
    <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconEvents = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
    <path d="M8 2v4M16 2v4M3 9h18M5 13h14M5 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50" dir="rtl">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-right">مدیریت اعزام</span>
              <IconDispatch />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-slate-600 mb-4">ورود به صفحه دیسپچ برای مدیریت تماس‌ها و اعزام تیم‌ها</p>
            <Button className="w-full" onClick={() => navigate('/dispatch')}>رفتن به دیسپچ</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-right">رویدادها</span>
              <IconEvents />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-slate-600 mb-4">مشاهده و پیگیری رویدادها و گزارش‌های ثبت شده</p>
            <Button className="w-full" variant="outline" onClick={() => navigate('/events')}>مشاهده رویدادها</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


