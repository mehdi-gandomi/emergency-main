import { useState, useEffect } from "react";
import { SoftphonePanel } from "./SoftphonePanel";
import IncidentForm from "./IncidentForm";
import { SideCards } from "./SideCards";
import { DispatcherSection } from "./DispatcherSection";
import { useToast } from "@/hooks/use-toast";
import { api, setToken } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Clock, 
  Phone, 
  Settings, 
  Bell,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Moon,
  Sun,
  History,
  FileText,
  Wifi,
  WifiOff,
  LogOut,
  User
} from "lucide-react";
import { IncidentTypeChart, RealTimeMetricsChart } from '@/components/charts';
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { Link } from "react-router-dom";
import { LogoutDialog } from "@/components/LogoutDialog";
import { ProfileDialog } from "@/components/ProfileDialog";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Add these imports

export const EmergencyDashboard = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const { toast } = useToast();
  
  // Keyboard shortcuts for panel collapse
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + L to toggle left panel
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setLeftPanelCollapsed(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  const { isOnline, isReconnecting, lastOnlineTime, connectionLostTime } = useConnectionStatus();

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate data refresh - in real app this would fetch new data
      console.log('Auto-refreshing dashboard data...');
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else if (stored === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        }
      }
    } catch {}
  }, []);

  // Reflect dark mode on the <html> element and persist
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch {}
    }
  }, [isDarkMode]);

  // Connection status is provided by useConnectionStatus hook

  const handleAnswerCall = () => {
    setIsCallActive(true);
    toast({
      title: "تماس پاسخ داده شد",
      description: "تماس اضطراری فعال است",
      className: "bg-active-call text-active-call-foreground",
    });
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    toast({
      title: "تماس خاتمه یافت",
      description: "تماس اضطراری قطع شد",
      variant: "destructive",
    });
  };

  const handleHoldCall = () => {
    toast({
      title: "تماس در انتظار",
      description: "تماس در حالت انتظار قرار گرفت",
      className: "bg-warning text-warning-foreground",
    });
  };

  const handleMuteCall = () => {
    toast({
      title: "صدا قطع شد",
      description: "میکروفون خاموش شد",
      className: "bg-warning text-warning-foreground",
    });
  };

  const handleTransferCall = () => {
    toast({
      title: "انتقال تماس",
      description: "انتقال تماس آغاز شد",
    });
  };

  const handleLogout = async (reason: any) => {
    try {
      await api.post('/logout', {
        type: reason.type,
        description: reason.description,
        duration: reason.duration,
        supervisorApproval: !!reason.supervisorApproval,
        smsSent: !!reason.smsSent,
      });
    } catch {}
    setToken(null);
    try { localStorage.removeItem('user'); } catch {}
    toast({
      title: "خروج از سیستم",
      description: `شما با موفقیت از سیستم خارج شدید.`,
      variant: "default",
    });
    window.location.href = '/login';
  };

  // Fetch profile on mount
  useEffect(() => {
    (async () => {
      try {
        const me = await api.get('/user');
        try { localStorage.setItem('user', JSON.stringify(me.data)); } catch {}
      } catch (e) {
        // token invalid -> redirect to login
        // window.location.href = '/login';
      }
    })();
  }, []);

  // Live time (updates every second)
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString('fa-IR'));
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('fa-IR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const activeIncidents = 3;
  const pendingCalls = 2;
  const operatorsOnline = 8;
  const operatorsOffline = 2;
  const operatorsInCall = 5;
  const failedCalls24h = 12;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_25%,rgba(68,68,68,.1)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.1)_75%)] bg-size-[8px_8px] animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-8 lg:space-y-10  mx-auto">
        {/* Enhanced Header */}
        <header className="relative">
          {/* Glass Card Effect */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center space-x-6" dir="rtl">
                <div className="flex justify-between w-full">
                  <div className="flex items-center space-x-4">
                  <div className="bg-linear-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl px-4 md:text-4xl font-bold bg-linear-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      مرکز پاسخگویی تماس های اضطراری ۱۱۲
                    </h1>
                    <p className="text-slate-600 px-4 dark:text-slate-400 text-base md:text-lg">
                      کنسول دریافت تماس اضطراری
                    </p>
                  </div>
                  </div>
                  <div className="flex gap-2">
                  <Link to="/operators" title="مدیریت اپراتورها">
                    <Button
                      asChild={false}
                      variant="outline"
                      size="icon"
                      className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/queue" title="نظارت بر صف تماس‌ها">
                    <Button
                      asChild={false}
                      variant="outline"
                      size="icon"
                      className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/history" title="تاریخچه تماس‌ها">
                    <Button
                      asChild={false}
                      variant="outline"
                      size="icon"
                      className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/logs" title="سیستم ثبت دقیق تماس‌ها">
                    <Button
                      asChild={false}
                      variant="outline"
                      size="icon"
                      className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowProfileDialog(true)}
                    className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200"
                    title="پروفایل کاربری"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowLogoutDialog(true)}
                    className="bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-white/20 transition-all duration-200 hover:bg-red-50 hover:border-red-200"
                    title="خروج از سیستم"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                  </div>
                </div>
              </div>

              {/* Status Cards under title - All in one row */}
              <div className="grid w-full items-stretch gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                <div className="bg-linear-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-200/50 rounded-lg p-2 text-center backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {activeIncidents}
                  </div>
                  <div className="text-xs text-emerald-600/80 dark:text-emerald-300/80">
                    ماموریت های فعال
                  </div>
                </div>
                
                <div className="bg-linear-to-br from-amber-500/10 to-amber-600/10 border border-amber-200/50 rounded-lg p-2 text-center backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center mb-1">
                    <Phone className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    {pendingCalls}
                  </div>
                  <div className="text-xs text-amber-600/80 dark:text-amber-300/80">
                    صف انتظار
                  </div>
                </div>
                
                <div className="bg-linear-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/50 rounded-lg p-2 text-center backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
                    {operatorsOnline}
                  </div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-300/80">
                    اپراتور آنلاین
                  </div>
                </div>
                
                <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 border border-purple-200/50 rounded-lg p-2 text-center backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-sm font-bold text-purple-700 dark:text-purple-400 font-mono">
                    {currentTime}
                  </div>
                  <div className="text-xs text-purple-600/80 dark:text-purple-300/80">
                    زمان فعلی
                  </div>
                </div>

                <div className="bg-linear-to-br from-red-500/10 to-red-600/10 border border-red-200/50 rounded-lg p-2 text-center backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-lg font-bold text-red-700 dark:text-red-400">
                    {operatorsOffline}
                  </div>
                  <div className="text-xs text-red-600/80 dark:text-red-300/80">
                    آفلاین
                  </div>
                </div>
                
                <div className="bg-linear-to-br from-green-500/10 to-green-600/10 border border-green-200/50 rounded-lg p-2 text-center backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center mb-1">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">
                    {operatorsInCall}
                  </div>
                  <div className="text-xs text-green-600/80 dark:text-green-300/80">
                    در حال پاسخگویی
                  </div>
                </div>
                
                <div className="bg-linear-to-br from-orange-500/10 to-orange-600/10 border border-orange-200/50 rounded-lg p-2 text-center backdrop-blur-sm cursor-pointer hover:shadow-lg transition-all">
                  <div className="flex items-center justify-center mb-1">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-400">
                    {failedCalls24h}
                  </div>
                  <div className="text-xs text-orange-600/80 dark:text-orange-300/80">
                    ناموفق (24س)
                  </div>
                </div>

                {/* Communication Channels */}
                <div className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                  <div className="text-center space-y-1">
                    <div className="text-xs text-slate-600 dark:text-slate-400">کانال های ارتباطی</div>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-1 py-0.5 rounded text-xs">
                        مرکزی
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-1 py-0.5 rounded text-xs">
                        استان
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-emerald-600 dark:text-emerald-400">متصل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2 animate-gentle-pulse">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">سیستم آماده دریافت تماس</span>
            </div>
          </div>
        </header>
        
        {/* Main Dashboard Grid - RTL order: Softphone (right), Form (center), Side (left) */}
        <div className={`grid gap-6 lg:gap-8 transition-all duration-500 ease-in-out ${
          leftPanelCollapsed 
            ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1 lg:grid-cols-3 xl:grid-cols-4'
        }`} dir="rtl">
          {/* Softphone Panel - Right on desktop */}
          <div className={`xl:col-span-1 order-1 lg:order-1 sticky top-6 self-start transition-all duration-300 ease-in-out relative ${
            rightPanelCollapsed ? 'lg:w-14 lg:min-w-14 lg:max-w-14' : ''
          }`}>
            {/* Collapse Button for Right Panel - Hidden for now */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              className="hidden"
              title={rightPanelCollapsed ? 'بازکردن پنل صوتی' : 'بستن پنل صوتی'}
            >
              {rightPanelCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            
            {/* Softphone Panel Container */}
            {rightPanelCollapsed ? (
              <div className="hidden lg:flex bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg h-16 w-14 items-center justify-center hover:shadow-xl transition-all duration-300 cursor-pointer group"
                   onClick={() => setRightPanelCollapsed(false)}
                   title="کلیک کنید تا پنل صوتی را باز کنید">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
            ) : (
              <div className="transition-all duration-300 opacity-100">
                <SoftphonePanel
                  isCallActive={isCallActive}
                  onAnswerCall={handleAnswerCall}
                  onEndCall={handleEndCall}
                  onHoldCall={handleHoldCall}
                  onMuteCall={handleMuteCall}
                  onTransferCall={handleTransferCall}
                />
              </div>
            )}
          </div>

          {/* Incident Form - Center */}
          <div className={`transition-all duration-500 ease-in-out ${
            leftPanelCollapsed 
              ? 'col-span-1 lg:col-span-1 xl:col-span-2'
              : 'col-span-1 lg:col-span-1 xl:col-span-2'
            } order-3 lg:order-2`}>
            <IncidentForm />
          </div>

          {/* Side Cards - Left on desktop */}
          <div className={`xl:col-span-1 order-2 lg:order-3 sticky top-6 self-start transition-all duration-300 ease-in-out relative ${
            leftPanelCollapsed ? 'lg:w-14 lg:min-w-14 lg:max-w-14' : ''
          }`}>
            {/* Collapse Button for Left Panel */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              className={`absolute top-6 z-30 bg-white/90 dark:bg-slate-800/90 shadow-lg rounded-full hidden lg:flex hover:bg-blue-50 dark:hover:bg-slate-700 backdrop-blur-sm border-2 border-blue-200 dark:border-slate-600 transition-all duration-300 ${
                leftPanelCollapsed 
                  ? '-right-7 hover:scale-110' 
                  : '-right-3'
              }`}
              title={leftPanelCollapsed ? 'بازکردن کارت های جانبی (Ctrl+Shift+L)' : 'بستن کارت های جانبی (Ctrl+Shift+L)'}
            >
              {leftPanelCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            
            {/* Side Cards Container */}
            {leftPanelCollapsed ? (
              <>
                {/* Fixed positioned collapsed panel on the left */}
                <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-16 items-center justify-center hover:shadow-3xl transition-all duration-300 cursor-pointer group animate-in slide-in-from-left-5"
                     onClick={() => setLeftPanelCollapsed(false)}
                     title="کلیک کنید تا کارت های جانبی را باز کنید (Ctrl+Shift+L)">
                  <div className="py-3 space-y-2">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400 group-hover:scale-125 transition-transform mx-auto" />
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mx-auto opacity-70 shadow-lg"></div>
                  </div>
                  {/* <div className="text-xs text-slate-600 dark:text-slate-300 transform rotate-90 whitespace-nowrap py-3 font-medium">
                    کارت ها
                  </div> */}
                </div>
                {/* Empty div to maintain grid structure when collapsed */}
                <div className="hidden"></div>
              </>
            ) : (
              <div className="transition-all duration-500 opacity-100 animate-in slide-in-from-left-3">
                <SideCards />
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <IncidentTypeChart />
          <RealTimeMetricsChart />
        </div> */}

        {/* Dispatcher Section - Bottom */}
        {/* <div className="w-full">
          <DispatcherSection />
        </div> */}

        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 z-50 space-y-3">
          {/* <Button 
            size="lg"
            className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <AlertTriangle className="h-6 w-6 mr-2" />
            تماس اضطراری جدید
          </Button> */}
{/*           
          <Button 
            size="lg"
            className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Phone className="h-6 w-6 mr-2" />
            eCall
          </Button> */}
        </div>
      </div>

      {/* Dialogs */}
      <ProfileDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog} 
      />
      <LogoutDialog 
        open={showLogoutDialog} 
        onOpenChange={setShowLogoutDialog}
        onLogout={handleLogout}
      />
    </div>
  );
};