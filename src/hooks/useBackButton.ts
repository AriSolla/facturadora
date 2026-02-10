import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const listener = App.addListener('backButton', ({ canGoBack }) => {
      // Si estamos en Home, salir de la app
      if (location.pathname === '/') {
        // App.exitApp();
      } 
      // Si no, navegar hacia atrás
      else if (canGoBack) {
        navigate(-1);
      } 
      // Si no puede ir atrás, ir a Home
      else {
        navigate('/');
      }
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, [navigate, location]);
}