import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneOff, 
  Pause, 
  Mic, 
  MicOff, 
  ArrowRightLeft, 
  Signal, 
  Clock,
  PhoneCall,
  Volume2,
  VolumeX,
  Headphones,
  Radio,
  ChevronLeft,
  Sun,
  Moon,
  Bell,
  BellOff,
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react";

interface SoftphonePanelProps {
  isCallActive: boolean;
  onAnswerCall: () => void;
  onEndCall: () => void;
  onHoldCall: () => void;
  onMuteCall: () => void;
  onTransferCall: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const SoftphonePanel = ({
  isCallActive,
  onAnswerCall,
  onEndCall,
  onHoldCall,
  onMuteCall,
  onTransferCall,
  isDarkMode = false,
  onToggleDarkMode
}: SoftphonePanelProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isOnHold, setIsOnHold] = useState(false);
  const [resolutionTimer, setResolutionTimer] = useState(90); // 90 seconds
  const [isTimerExtended, setIsTimerExtended] = useState(false);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callQuality, setCallQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [callerNumber, setCallerNumber] = useState('+98 912 345 6789');
  const [volume, setVolume] = useState(75);
  const [isTransferOpen, setIsTransferOpen] = useState(true);
  const [transferNumber, setTransferNumber] = useState("");
  const [showDurationAlert, setShowDurationAlert] = useState(false);
  const [isDndActive, setIsDndActive] = useState(false);
  const [isDndLoading, setIsDndLoading] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [config, setConfig] = useState({
    url: 'ws://localhost:8088/ws',
    domain: 'asterisk.local',
    extension: '1001',
    password: ''
  });
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && !isOnHold) {
      interval = setInterval(() => {
        setCallDuration(prev => {
          const newDuration = prev + 1;
          // Alert when call duration reaches 2 minutes (120 seconds)
          if (newDuration === 120 && !showDurationAlert) {
            setShowDurationAlert(true);
            playAlarmSound();
          }
          return newDuration;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, isOnHold, showDurationAlert]);

  // 90-second resolution timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive && !isOnHold) {
      interval = setInterval(() => {
        setResolutionTimer(prev => {
          if (prev <= 1) {
            // Timer expired - show extension dialog
            setShowExtensionDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, isOnHold]);

  const handleRequestExtension = () => {
    setIsTimerExtended(true);
    setResolutionTimer(90); // Reset to 90 seconds
    setShowExtensionDialog(false);
  };

  const handleCompleteCall = () => {
    setShowExtensionDialog(false);
    setResolutionTimer(90);
    setIsTimerExtended(false);
    onEndCall();
  };

  // Initialize alarm audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      alarmAudioRef.current = new Audio();
      // Create a simple alarm sound using Web Audio API
      const createAlarmSound = () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      };
      
      alarmAudioRef.current.onplay = createAlarmSound;
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playAlarmSound = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.play().catch(() => {
        // Fallback: create alarm sound directly
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      });
    }
  };

  const handleExtendCall = () => {
    setShowDurationAlert(false);
  };

  const handleDndToggle = async () => {
    setIsDndLoading(true);
    try {
      // Mock AJAX request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsDndActive(!isDndActive);
      // Here you would typically send the DND status to your server
      console.log(`DND ${!isDndActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Failed to toggle DND:', error);
    } finally {
      setIsDndLoading(false);
    }
  };
  const handleConfigChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');
    
    try {
      // Mock connection test - replace with actual WebSocket connection logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure based on URL format
      if (config.url.startsWith('ws://') || config.url.startsWith('wss://')) {
        setConnectionStatus('success');
      } else {
        throw new Error('Invalid WebSocket URL');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('Connection test failed:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConfig = () => {
    // Save configuration to localStorage or send to server
    localStorage.setItem('softphone_config', JSON.stringify(config));
    setShowConfigModal(false);
    console.log('Configuration saved:', config);
  };
  const handleHold = () => {
    setIsOnHold(!isOnHold);
    onHoldCall();
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    onMuteCall();
  };

  const getQualityColor = () => {
    switch (callQuality) {
      case 'excellent': return 'text-emerald-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const getQualityBars = () => {
    const bars = callQuality === 'excellent' ? 5 : callQuality === 'good' ? 3 : 1;
    return Array.from({ length: 5 }, (_, i) => (
      <div 
        key={i} 
        className={`w-1 rounded-full ${
          i < bars 
            ? getQualityColor().replace('text-', 'bg-')
            : 'bg-slate-200 dark:bg-slate-700'
        }`}
        style={{ height: `${(i + 1) * 4 + 8}px` }}
      />
    ));
  };

  const ensureAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current as AudioContext;
  };

  const dtmfMap: Record<string, [number, number]> = {
    '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
    '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
    '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
    '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
  };

  const playDtmf = (digit: string) => {
    const freqs = dtmfMap[digit];
    if (!freqs) return;
    const ctx = ensureAudioContext();
    const [f1, f2] = freqs;
    const duration = 0.12; // seconds
    const release = 0.06;
    const now = ctx.currentTime;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(f1, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(f2, now);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    gain.gain.setTargetAtTime(0.0001, now + duration, release);
    const stopAt = now + duration + release + 0.02;
    osc1.stop(stopAt);
    osc2.stop(stopAt);
  };

  const appendDigit = (d: string) => {
    setTransferNumber(prev => (prev + d).slice(0, 20));
    try { playDtmf(d); } catch {}
  };
  const backspace = () => setTransferNumber(prev => prev.slice(0, -1));
  const clearNumber = () => setTransferNumber("");
  const openTransfer = () => setIsTransferOpen(prev => !prev);
  const closeTransfer = () => setIsTransferOpen(false);
  const confirmTransfer = () => {
    onTransferCall();
    setIsTransferOpen(false);
  };

  // Keyboard bindings when dialpad is open
  // useEffect(() => {
  //   if (!isTransferOpen) return;
  //   const handleKey = (e: KeyboardEvent) => {
  //     // Ignore when focused in an input or textarea other than our dialpad input
  //     const target = e.target as HTMLElement | null;
  //     const tag = target?.tagName?.toLowerCase();
  //     const isEditable = tag === 'input' || tag === 'textarea' || (target as any)?.isContentEditable;
  //     // Allow our dialpad input to naturally accept keys; we still want dtmf on digits
  //     if (isEditable && tag !== 'input') return;

  //     const key = e.key;
  //     if (/^[0-9]$/.test(key) || key === '*' || key === '#') {
  //       e.preventDefault();
  //       appendDigit(key);
  //     } else if (key === 'Backspace') {
  //       e.preventDefault();
  //       backspace();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKey);
  //   return () => window.removeEventListener('keydown', handleKey);
  // }, [isTransferOpen]);

  return (
    <>
    <Card className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-2xl" dir="rtl">
      <CardHeader className="pb-4">
        {/* Title Section */}
        <CardTitle className="flex items-center space-x-3 mb-4">
          <div className="bg-linear-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold mx-2">خط اضطراری ۱۱۲</span>
            <div className="text-sm text-slate-500 mx-2 dark:text-slate-400">
              خط مستقیم اورژانس
            </div>
          </div>
        </CardTitle>
        
        {/* Controls and Indicators Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Signal Quality Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {getQualityBars()}
            </div>
            <Badge 
              variant="outline" 
              className={`${getQualityColor()} border-current bg-current/10 font-medium`}
            >
              <Signal className="h-3 w-3 mr-1" />
              {callQuality === 'excellent' ? 'عالی' : callQuality === 'good' ? 'خوب' : 'ضعیف'}
            </Badge>
                        {/* Settings Button */}
                        <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfigModal(true)}
              className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            {onToggleDarkMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDarkMode}
                className="p-2 h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            {/* DND Button */}
            <Button
              variant={isDndActive ? "default" : "outline"}
              size="sm"
              onClick={handleDndToggle}
              disabled={isDndLoading}
              className={`h-8 px-3 rounded-lg transition-all duration-300 ${
                isDndActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80'
              }`}
            >
              {isDndLoading ? (
                <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isDndActive ? (
                <BellOff className="h-3 w-3" />
              ) : (
                <Bell className="h-3 w-3" />
              )}
              <span className="mr-1 text-xs">
                {isDndActive ? 'DND' : 'DND'}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Call Status Display */}
        <div className="text-center space-y-4">
          {isCallActive && (
            <div className="bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-6 border">
              <div className="text-lg font-semibold text-slate-600 dark:text-slate-200 mb-2">
                تماس دریافتی
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1" dir="ltr">
                {callerNumber}
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <PhoneCall className="h-3 w-3 mr-1" />
                شماره تماس گیرنده
              </Badge>
            </div>
          )}

          {/* Duration Alert */}
          {showDurationAlert && (
            <div className="bg-linear-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800 animate-gentle-pulse opacity-80">
              <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-orange-500 p-3 rounded-full animate-bounce opacity-80">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-800 dark:text-orange-200">
                    هشدار زمان تماس
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-300">
                    تماس بیش از ۲ دقیقه طول کشیده است
                  </div>
                </div>
              </div>
              <Button
                onClick={handleExtendCall}
                className="w-full h-12 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg rounded-xl transition-all duration-300"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                تایید ادامه تماس
              </Button>
            </div>
          )}

          <div className="flex gap-4">
               {/* Call Timer */}
               <div className="bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl p-3 border border-indigo-200/50 flex-1">

               <div className="flex items-center gap-2">

               <div className={`p-2 rounded-full ${
  isCallActive 
    ? isOnHold 
      ? 'bg-yellow-500 animate-pulse opacity-80' 
      : 'bg-emerald-500 animate-pulse opacity-80'
    : 'bg-slate-300 dark:bg-slate-600'
}`}>
                <Clock className="h-4 w-4 text-white" />

              </div>
              <div>
              <div className="text-xl font-mono font-bold text-slate-800 dark:text-white">

                  {formatTime(callDuration)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">

                  {isCallActive 
                    ? isOnHold 
                      ? "تماس در انتظار" 
                      : "مدت مکالمه"
                    : "آماده دریافت تماس"
                  }
                </div>
              </div>
            </div>
          </div>

          {/* 90-Second Resolution Timer */}
          {isCallActive && (
            <div className={`rounded-xl p-3 border-2 flex-1 ${
              resolutionTimer <= 10 
                ? 'bg-linear-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-800 animate-pulse opacity-80'
                : resolutionTimer <= 30
                  ? 'bg-linear-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800'
                  : 'bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">

              <div className={`p-2 rounded-full ${
  resolutionTimer <= 10 
    ? 'bg-red-500 animate-bounce opacity-80' 
    : resolutionTimer <= 30
      ? 'bg-orange-500'
      : 'bg-blue-500'
}`}>
                  <Clock className="h-4 w-4 text-white" />

                </div>
                <div>
                <div className={`text-xl font-mono font-bold ${
                    resolutionTimer <= 10 
                      ? 'text-red-800 dark:text-red-200' 
                      : resolutionTimer <= 30
                        ? 'text-orange-800 dark:text-orange-200'
                        : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {Math.floor(resolutionTimer / 60)}:{(resolutionTimer % 60).toString().padStart(2, '0')}
                  </div>
                  <div className={`text-xs ${
                    resolutionTimer <= 10 
                      ? 'text-red-600 dark:text-red-300' 
                      : resolutionTimer <= 30
                        ? 'text-orange-600 dark:text-orange-300'
                        : 'text-blue-600 dark:text-blue-300'
                  }`}>
                    {isTimerExtended ? 'زمان تمدید شده' : 'زمان باقی‌مانده'}
                  </div>
                </div>
              </div>
              {resolutionTimer <= 30 && (
                <div className="text-center">
                  <Button
                onClick={() => setShowExtensionDialog(true)}
                size="sm"
                className={`h-8 px-3 rounded-lg text-xs transition-all duration-300 ${
                      resolutionTimer <= 10 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    تمدید زمان
                  </Button>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Volume Control */}
        {isCallActive && (
          <div className="bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                کنترل صدا
              </span>
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-slate-400" />
                <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-blue-400 to-blue-500 transition-all duration-300"
                    style={{ width: `${volume}%` }}
                  />
                </div>
                <Volume2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-500 min-w-8">
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Call Control Buttons */}
        <div className="space-y-4">
          {!isCallActive ? (
            <Button
              onClick={onAnswerCall}
              className="w-full h-16 text-lg font-semibold bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <div>پاسخ دادن</div>
                  <div className="text-sm opacity-90">تماس اضطراری</div>
                </div>
              </div>
            </Button>
          ) : (
            <>
              {/* Primary Controls */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onEndCall}
                  className="h-14 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg rounded-xl transition-all duration-300"
                >
                  <PhoneOff className="h-5 w-5 mr-2" />
                  قطع تماس
                </Button>
                
                <Button
                  onClick={handleHold}
                  variant={isOnHold ? "default" : "outline"}
                  className={`h-14 rounded-xl transition-all duration-300 ${
                    isOnHold 
                      ? 'bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-2'
                  }`}
                >
                  <Pause className="h-5 w-5 mr-2" />
                  {isOnHold ? "ادامه" : "انتظار"}
                </Button>
              </div>

              {/* Secondary Controls */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleMute}
                  variant={isMuted ? "default" : "outline"}
                  className={`h-12 rounded-xl transition-all duration-300 ${
                    isMuted 
                      ? 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-2'
                  }`}
                >
                  {isMuted ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isMuted ? "روشن" : "خاموش"}
                </Button>

                <Button
                  onClick={openTransfer}
                  variant="outline"
                  className="h-12 bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/80 backdrop-blur-sm border-2 rounded-xl transition-all duration-300"
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  انتقال
                </Button>
              </div>

              {isTransferOpen && (
                <div className="mt-3 space-y-4 bg-transparent">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">شماره مقصد</span>
                    <button type="button" onClick={() => setIsTransferOpen(false)} className="text-xs px-2 py-1 rounded-md border border-slate-200/30 dark:border-slate-700/40 hover:bg-slate-500/10 transition">
                      بستن
                    </button>
                  </div>
                  <div className="rounded-xl p-2 border border-slate-200/30 dark:border-slate-700/40 flex items-center justify-between bg-transparent" dir="ltr">
                    <input
                      className="bg-transparent outline-none w-full text-2xl font-mono text-slate-900 dark:text-white text-right"
                      value={transferNumber}
                      onChange={(e) => setTransferNumber(e.target.value.replace(/[^0-9*#+]/g, '').slice(0, 20))}
                      placeholder=""
                    />
                    <button type="button" onClick={backspace} className="p-2 rounded-lg hover:bg-slate-500/10 transition">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 select-none" dir="ltr" style={{direction:"ltr"}}>
                    {[
                      ['1','ABC'], ['2','ABC'], ['3','DEF'],
                      ['4','GHI'], ['5','JKL'], ['6','MNO'],
                      ['7','PQRS'], ['8','TUV'], ['9','WXYZ'],
                      ['*',''], ['0','+'], ['#','']
                    ].map(([d, sub]) => (
                      <button
                        key={d+sub}
                        type="button"
                        onClick={() => appendDigit(d)}
                        className="group rounded-2xl border border-slate-200/30 dark:border-slate-700/40 bg-transparent hover:bg-slate-500/10 dark:hover:bg-white/10 shadow-sm transition p-4 flex flex-col items-center justify-center"
                      >
                        <span className="text-2xl font-semibold">{d}</span>
                        <span className="text-[10px] tracking-widest text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">{sub}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Button onClick={clearNumber} variant="outline" className="flex-1 h-12 rounded-xl">
                      پاک کردن
                    </Button>
                    <Button onClick={confirmTransfer} className="flex-1 h-12 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                      انتقال به شماره
                    </Button>
                  </div>
                </div>
              )}

              {/* Advanced Controls */}
              <div className="bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 justify-start"
                  >
                    <Headphones className="h-3 w-3 mr-1" />
                    هدفون
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 justify-start"
                  >
                    <Radio className="h-3 w-3 mr-1" />
                    بیسیم
                  </Button> */}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isCallActive 
              ? isOnHold
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isCallActive 
                ? isOnHold 
                  ? 'bg-yellow-500 animate-pulse' 
                  : 'bg-emerald-500 animate-pulse'
                : 'bg-slate-400'
            }`} />
            {isCallActive 
              ? isOnHold 
                ? 'در انتظار' 
                : 'متصل'
              : 'آماده'
            }
          </div>
        </div>
            {/* Configuration Modal */}
    {showConfigModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              تنظیمات اتصال
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfigModal(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>

          <div className="space-y-4">
            {/* WebSocket URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                آدرس WebSocket
              </label>
              <input
                type="text"
                value={config.url}
                onChange={(e) => handleConfigChange('url', e.target.value)}
                placeholder="ws://localhost:8088/ws"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                dir="ltr"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                دامنه
              </label>
              <input
                type="text"
                value={config.domain}
                onChange={(e) => handleConfigChange('domain', e.target.value)}
                placeholder="asterisk.local"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                dir="ltr"
              />
            </div>

            {/* Extension */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                داخلی
              </label>
              <input
                type="text"
                value={config.extension}
                onChange={(e) => handleConfigChange('extension', e.target.value)}
                placeholder="1001"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                dir="ltr"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                value={config.password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                dir="ltr"
              />
            </div>

            {/* Connection Status */}
            {connectionStatus !== 'idle' && (
              <div className={`p-3 rounded-lg ${
                connectionStatus === 'testing' 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : connectionStatus === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  {connectionStatus === 'testing' && (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  {connectionStatus === 'success' && <CheckCircle className="h-4 w-4" />}
                  {connectionStatus === 'error' && <AlertTriangle className="h-4 w-4" />}
                  <span className="text-sm">
                    {connectionStatus === 'testing' && 'در حال تست اتصال...'}
                    {connectionStatus === 'success' && 'اتصال موفقیت‌آمیز'}
                    {connectionStatus === 'error' && 'خطا در اتصال'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              variant="outline"
              className="flex-1 h-12 rounded-xl"
            >
              {isTestingConnection ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Signal className="h-4 w-4 mr-2" />
              )}
              تست اتصال
            </Button>
            <Button
              onClick={handleSaveConfig}
              className="flex-1 h-12 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              ذخیره
            </Button>
          </div>
        </div>
      </div>
    )}
      </CardContent>
    </Card>

    {/* Extension Dialog */}
    {showExtensionDialog && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              زمان تعیین تکلیف به پایان رسید
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              طبق استاندارد، تماس باید ظرف 90 ثانیه تعیین و تکلیف شود. آیا می‌خواهید زمان بیشتری درخواست کنید؟
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleCompleteCall}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                تکمیل تماس
              </Button>
              <Button
                onClick={handleRequestExtension}
                className="flex-1 h-12 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                درخواست تمدید
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};