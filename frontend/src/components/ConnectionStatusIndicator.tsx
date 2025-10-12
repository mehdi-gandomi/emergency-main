import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useConnectionStatus } from '@/hooks/use-connection-status';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ConnectionStatusIndicatorProps {
  showFullAlert?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  className?: string;
  /**
   * Controls rendering style.
   * - 'fixed-alert' keeps the previous behavior (shows a fixed alert when offline)
   * - 'inline-card' renders a compact card intended for header/toolbars with no fixed positioning
   */
  variant?: 'fixed-alert' | 'inline-card';
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  showFullAlert = true,
  position = 'top-right',
  className,
  variant = 'fixed-alert',
}) => {
  const { isOnline, isReconnecting, lastOnlineTime, connectionLostTime } = useConnectionStatus();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedAlert = useRef(false);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(console.error);
    }
  }, []);

  // Create audio element for connection loss alert
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, []);

  // Play alert sound when connection is lost
  useEffect(() => {
    if (!isOnline && !hasPlayedAlert.current) {
      hasPlayedAlert.current = true;
      
      // Try to play a system beep using Web Audio API
      const playAlertSound = () => {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          
          // Create a sequence of beeps for more noticeable alert
          const playBeep = (frequency: number, startTime: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + startTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + duration);
            
            oscillator.start(audioContext.currentTime + startTime);
            oscillator.stop(audioContext.currentTime + startTime + duration);
          };
          
          // Play three beeps: high, low, high
          playBeep(1000, 0, 0.2);
          playBeep(600, 0.3, 0.2);
          playBeep(1000, 0.6, 0.2);
          
        } catch (error) {
          console.warn('Could not play audio alert:', error);
          
          // Fallback: try to use system beep if available
          try {
            // This might work in some environments
            console.log('\u0007'); // Bell character
          } catch (fallbackError) {
            console.warn('Fallback audio alert also failed:', fallbackError);
          }
        }
      };
      
      // Play the alert sound
      playAlertSound();
      
      // Also try to show a browser notification if permission is granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Connection Lost', {
          body: 'Your internet connection has been lost. The system is attempting to reconnect.',
          icon: '/favicon.ico',
          tag: 'connection-lost'
        });
      }
      
    } else if (isOnline) {
      hasPlayedAlert.current = false;
    }
  }, [isOnline]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getConnectionDuration = () => {
    if (!isOnline && connectionLostTime) {
      const duration = Math.floor((Date.now() - connectionLostTime.getTime()) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return null;
  };

  const getLastOnlineTime = () => {
    if (lastOnlineTime) {
      return lastOnlineTime.toLocaleTimeString();
    }
    return null;
  };

  // Inline header-friendly card
  if (variant === 'inline-card') {
    return (
      <div className={cn('rounded-xl p-4 border min-w-[220px] backdrop-blur-sm',
        isOnline ? 'bg-emerald-50/70 border-emerald-200/60 dark:bg-emerald-900/20' : 'bg-red-50/70 border-red-200/60 dark:bg-red-900/20',
        className
      )}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full animate-pulse', isOnline ? 'bg-emerald-500' : 'bg-red-500')} />
            <div className={cn('text-sm font-medium', isOnline ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400')}>
              {isOnline ? 'اینترنت متصل است' : 'اتصال اینترنت قطع شد'}
            </div>
          </div>
          {isOnline ? (
            <Wifi className={cn('w-4 h-4', isOnline ? 'text-emerald-600' : 'text-red-600')} />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
        </div>
      </div>
    );
  }

  if (isOnline && !showFullAlert) {
    return (
      <div className={cn('fixed z-50', getPositionClasses(), className)}>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <Wifi className="w-3 h-3 mr-1" />
          Online
        </Badge>
      </div>
    );
  }

  if (isOnline) {
    return null; // Don't show anything when online and showFullAlert is true
  }

  return (
    <div className={cn('fixed z-50 max-w-sm', getPositionClasses(), className)}>
      <Alert className={cn(
        'border-red-200 bg-red-50 shadow-lg',
        isReconnecting && 'animate-pulse'
      )}>
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center gap-2 mb-2">
            <WifiOff className="w-4 h-4" />
            <span className="font-semibold">Connection Lost</span>
            {isReconnecting && <Loader2 className="w-3 h-3 animate-spin" />}
          </div>
          
          <div className="text-sm space-y-1">
            {connectionLostTime && (
              <div>
                Offline for: <span className="font-mono">{getConnectionDuration()}</span>
              </div>
            )}
            
            {lastOnlineTime && (
              <div>
                Last online: <span className="font-mono">{getLastOnlineTime()}</span>
              </div>
            )}
            
            {isReconnecting && (
              <div className="text-xs text-red-600">
                Attempting to reconnect...
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ConnectionStatusIndicator;
