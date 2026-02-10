import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Network } from '@capacitor/network';

interface AppContextType {
  isOnline: boolean;
  ultimaSync: Date | null;
  actualizarUltimaSync: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [ultimaSync, setUltimaSync] = useState<Date | null>(null);

  // Monitorear cambios de conectividad en tiempo real
  useEffect(() => {
    // Estado inicial
    Network.getStatus().then(status => {
      setIsOnline(status.connected);
    });

    // Listener de cambios
    const listener = Network.addListener('networkStatusChange', status => {
      setIsOnline(status.connected);
      console.log(`📡 Conexión cambió: ${status.connected ? 'ONLINE' : 'OFFLINE'}`);
    });

    // Cleanup
    return () => {
      listener.then(l => l.remove());
    };
  }, []);

  const actualizarUltimaSync = () => {
    setUltimaSync(new Date());
  };

  return (
    <AppContext.Provider value={{ isOnline, ultimaSync, actualizarUltimaSync }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar el context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
}