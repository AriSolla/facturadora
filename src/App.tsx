import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { SplashScreen } from '@/screens/SplashScreen';
import { AppRoutes } from '@/routes/AppRoutes';

function App() {
  const [ready, setReady] = useState(false);

  return (
    <BrowserRouter>
      {!ready ? (
        <SplashScreen onReady={() => setReady(true)} />
      ) : (
        <AppRoutes />
      )}
    </BrowserRouter>
  );
}

export default App;
