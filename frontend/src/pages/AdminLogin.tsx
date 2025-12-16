import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api, setToken } from "@/lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post<{ data:{token: string; user: any}, status: string, message?: string }>("/admin-login", {
        username,
        password
      });

      if(response.status === 'success' && response.data) {
        setToken(response.data.token);
        // ensure user has type=admin stored
        const user = { ...(response.data.user || {}), type: 'admin' };
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/admin-dashboard", { replace: true });
      } else {
        setError(response.message || "ورود ناموفق");
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "خطا در ورود ادمین");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-right">ورود ادمین</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-right block">نام کاربری</Label>
              <Input
                id="username"
                type="text"
                dir="ltr"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="نام کاربری یا کد ملی"
              />
            </div>
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
              onClick={() => navigate('/login')}
            >
              بازگشت
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;


