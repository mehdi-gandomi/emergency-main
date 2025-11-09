import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { settingsService } from '@/services/settingsService';

interface AppSettings {
  serverTime: string | null;
  serverTimestamp: number | null;
  timezone: string | null;
  lastSyncTime: number | null;
  timeDifference: number | null; // Difference in milliseconds (server - client)
}

interface AppStore {
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  syncServerTime: () => Promise<void>;
  getServerTime: () => Date;
  getServerTimeString: () => string;
  getFormattedServerTime: () => string;
}

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      settings: {
        serverTime: null,
        serverTimestamp: null,
        timezone: null,
        lastSyncTime: null,
        timeDifference: null,
      },
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      syncServerTime: async () => {
        try {
          const response = await settingsService.getSettings();
          
          if (response.status === 'success' && response.data) {
            const serverTime = new Date(response.data.server_time);
            const clientTime = new Date();
            const timeDifference = serverTime.getTime() - clientTime.getTime();
            
            set((state) => ({
              settings: {
                ...state.settings,
                serverTime: response.data.server_time,
                serverTimestamp: response.data.server_timestamp,
                timezone: response.data.timezone,
                lastSyncTime: Date.now(),
                timeDifference,
              },
            }));
          }
        } catch (error) {
          console.error('Failed to sync server time:', error);
          // Fallback to client time if sync fails
          set((state) => ({
            settings: {
              ...state.settings,
              lastSyncTime: Date.now(),
              timeDifference: 0,
            },
          }));
        }
      },
      getServerTime: () => {
        const state = get();
        const now = Date.now();
        
        // If we have a time difference and last sync time, use it
        if (state.settings.timeDifference !== null && state.settings.lastSyncTime !== null) {
          const elapsed = now - state.settings.lastSyncTime;
          return new Date(now + state.settings.timeDifference + elapsed);
        }
        
        // If we have server timestamp, calculate from it
        if (state.settings.serverTimestamp && state.settings.lastSyncTime) {
          const elapsed = now - state.settings.lastSyncTime;
          return new Date(state.settings.serverTimestamp * 1000 + elapsed);
        }
        
        // Fallback to client time
        return new Date();
      },
      getServerTimeString: () => {
        const serverTime = get().getServerTime();
        return serverTime.toISOString();
      },
      getFormattedServerTime: () => {
        const serverTime = get().getServerTime();
        return serverTime.toLocaleString('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      },
    }),
    {
      name: 'app-settings-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useAppStore;

