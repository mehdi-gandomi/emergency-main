import { useState, useEffect, useRef } from 'react';

interface ConnectionStatus {
  isOnline: boolean;
  isReconnecting: boolean;
  lastOnlineTime: Date | null;
  connectionLostTime: Date | null;
}

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    isReconnecting: false,
    lastOnlineTime: navigator.onLine ? new Date() : null,
    connectionLostTime: navigator.onLine ? null : new Date(),
  });

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);

  const checkConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to verify actual connectivity
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });
      return true;
    } catch (error) {
      // If fetch fails, try a simple ping to a reliable service
      try {
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
        });
        return true;
      } catch {
        return false;
      }
    }
  };

  const startReconnectionAttempts = () => {
    if (reconnectInterval.current) {
      clearInterval(reconnectInterval.current);
    }

    reconnectInterval.current = setInterval(async () => {
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        clearInterval(reconnectInterval.current!);
        setStatus(prev => ({ ...prev, isReconnecting: false }));
        return;
      }

      reconnectAttempts.current++;
      const isConnected = await checkConnection();
      
      if (isConnected) {
        clearInterval(reconnectInterval.current!);
        setStatus(prev => ({
          ...prev,
          isOnline: true,
          isReconnecting: false,
          lastOnlineTime: new Date(),
          connectionLostTime: null,
        }));
        reconnectAttempts.current = 0;
      }
    }, 3000); // Check every 3 seconds
  };

  useEffect(() => {
    const handleOnline = async () => {
      // Double-check with actual network request
      const isActuallyOnline = await checkConnection();
      
      setStatus(prev => ({
        ...prev,
        isOnline: isActuallyOnline,
        isReconnecting: false,
        lastOnlineTime: isActuallyOnline ? new Date() : prev.lastOnlineTime,
        connectionLostTime: isActuallyOnline ? null : prev.connectionLostTime,
      }));
      
      if (isActuallyOnline) {
        reconnectAttempts.current = 0;
        if (reconnectInterval.current) {
          clearInterval(reconnectInterval.current);
        }
      } else {
        setStatus(prev => ({ ...prev, isReconnecting: true }));
        startReconnectionAttempts();
      }
    };

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        isReconnecting: true,
        connectionLostTime: new Date(),
      }));
      startReconnectionAttempts();
    };

    // Initial connection check
    const initialCheck = async () => {
      const isConnected = await checkConnection();
      setStatus(prev => ({
        ...prev,
        isOnline: isConnected,
        isReconnecting: !isConnected,
        lastOnlineTime: isConnected ? new Date() : prev.lastOnlineTime,
        connectionLostTime: isConnected ? null : new Date(),
      }));

      if (!isConnected) {
        startReconnectionAttempts();
      }
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    initialCheck();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectInterval.current) {
        clearInterval(reconnectInterval.current);
      }
    };
  }, []);

  return status;
};
