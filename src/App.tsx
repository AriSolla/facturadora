import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';

import { SplashScreen } from '@/screens/SplashScreen';
import { AppRoutes } from '@/routes/AppRoutes';
import { AppProvider } from '@/context/AppContext';
import { useBackButton } from './hooks/useBackButton';

function AppContent() {
  useBackButton(); // Maneja el botón atrás

  return <AppRoutes />;
}
function App() {
  const [ready, setReady] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        {!ready ? (
          <SplashScreen onReady={() => setReady(true)} />
        ) : (
          <AppContent />
        )}
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
