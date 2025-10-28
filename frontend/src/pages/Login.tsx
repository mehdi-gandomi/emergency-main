import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, setToken } from "@/lib/api";
import {verifyPersonnel} from "@/services/personnelService";
import { Alert, AlertDescription } from "@/components/ui/alert";
export interface PersonnelVerificationResponse {
  status: 1 | 2 | 0; // 1: Admin, 2: Operator, 0: Not found
  role?: string;
  id?: number;
  name?: string;
  family?: string;
  shift?: string;
  date?: string;
  time_start?: string;
  time_end?: string;
  post?: string;
  center?: string;
  province?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [nationalCode, setNationalCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [personnelRole, setPersonnelRole] = useState<string | null>(null);
  const [personnelId, setPersonnelId] = useState<number | null>(null);
  const [personnelDetails, setPersonnelDetails] = useState<{
    name?: string;
    family?: string;
    shift?: string;
    date?: string;
    time_start?: string;
    time_end?: string;
    post?: string;
    province?: string;
    center?: string;
    status?:number
  } | null>(null);

  const verifyNationalCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalCode || nationalCode.length !== 10) {
      setError("کد ملی باید 10 رقم باشد");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      
      const response = await api.post<PersonnelVerificationResponse>("/verify-personnel", { national_code: nationalCode });
      if (response.status === 0) {
        setError("کد ملی وارد شده در سیستم یافت نشد");
        return;
      }
      if(!response.shift){
        setError(`با کد ملی ${nationalCode}  شما در این سیستم نقشی تعریف نشده است.`);
        return;
      }
      // Check if status is 1 (manager) and validate time access
      if (response.status === 1) {
        // Get current datetime
        const currentTime = new Date();
        
        // Parse time_start and time_end
        let [startHour, startMinute] = (response.time_start || "00:00").split(":").map(Number);
        let [endHour, endMinute] = (response.time_end || "23:59").split(":").map(Number);
        
        // Create Date objects for start and end times on current date
        const startTime = new Date(currentTime);
        startTime.setHours(startHour, startMinute, 0);
        // Subtract 1 hour from start time
        startTime.setHours(startTime.getHours() - 1);
        
        const endTime = new Date(currentTime);
        endTime.setHours(endHour, endMinute, 0);
        // Add 1 hour to end time
        endTime.setHours(endTime.getHours() + 1);
        
        // Check if current time is outside allowed window
        if (currentTime < startTime || currentTime > endTime) {
          setError("شما در این زمان اجازه دسترسی به سیستم را ندارید");
          setLoading(false);
          return;
        }
      }
      
      // Set personnel role based on status
      const role = response.status === 1 ? "مدیر" : "اپراتور";
      setPersonnelRole(role);
      setPersonnelId(response.id || null);
      
      // Store personnel details
      setPersonnelDetails({
        name: response.name,
        family: response.family,
        shift: response.shift,
        date: response.date,
        time_start: response.time_start,
        time_end: response.time_end,
        post: response.post,
        status: response.status,
        province: response.province,
        center: response.center
      });
      
      setVerificationStep(true);
    } catch (err: any) {
      setError(err.message || "خطا در بررسی کد ملی");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post<{ data:{token: string; user: any}, status: string, message?: string }>("/login", { 
        national_code: nationalCode,
        password ,
        personnelDetails
      });
      
      if(response.status === 'success' && response.data) {
        // Set token from the response data
        setToken(response.data.token);
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("shift_data",JSON.stringify(personnelDetails))
        if(personnelDetails.status == 1){
// Navigate to home page
        navigate("/dispatch", { replace: true });
        }else if(personnelDetails.status == 2){
navigate("/events", { replace: true });
        }
      } else {
        // Handle error response
        setError(response.message || "ورود ناموفق");
      }
    } catch (err: any) {
      // Handle network or other errors
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "نام کاربری یا رمز عبور یافت نشد");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-right">ورود به سیستم</CardTitle>
        </CardHeader>
        <CardContent>
          {!verificationStep ? (
            <form onSubmit={verifyNationalCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nationalCode" className="text-right block">کد ملی</Label>
                <Input 
                  id="nationalCode" 
                  type="text" 
                  dir="ltr" 
                  value={nationalCode} 
                  onChange={(e) => setNationalCode(e.target.value)} 
                  required 
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="کد ملی 10 رقمی"
                />
              </div>
              {error && <div className="text-red-600 text-sm text-right">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "در حال بررسی..." : "بررسی کد ملی"}
              </Button>
            </form>
          ) : (
            <>
              {personnelRole && personnelDetails && (
                <Alert className="mb-4">
                  <AlertDescription className="text-right flex flex-col gap-1">
                    <div>
                      <span className="font-bold">{personnelDetails.name} {personnelDetails.family}</span> عزیز، خوش آمدید
                    </div>
                    <div>استان: <span className="font-bold">{personnelDetails.province}</span></div>
                    <div>پایگاه: <span className="font-bold">{personnelDetails.center}</span></div>
                    <div>سمت: <span className="font-bold">{personnelDetails.post}</span></div>
                    <div>شیفت: <span className="font-bold">{personnelDetails.shift}</span></div>
                    <div>تاریخ شروع و پایان: <span className="font-bold">{personnelDetails.time_start} - {personnelDetails.time_end}</span></div>
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right block">رمز عبور</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    dir="ltr" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                {error && <div className="text-red-600 text-sm text-right">{error}</div>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "در حال ورود..." : "ورود"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setVerificationStep(false);
                    setPersonnelRole(null);
                    setPersonnelId(null);
                    setError("");
                  }}
                >
                  بازگشت
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;


