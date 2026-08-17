import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { settingsAPI } from '@/services/api';
import type { BusinessSettings } from '@/types';

interface SettingsContextValue {
  settings: BusinessSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({ settings: null, loading: true, refresh: async () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await settingsAPI.get();
      setSettings(res.data.data);
    } catch (e) { console.error('Failed to load settings', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return <SettingsContext.Provider value={{ settings, loading, refresh: load }}>{children}</SettingsContext.Provider>;
}

export function useSettings() { return useContext(SettingsContext); }
