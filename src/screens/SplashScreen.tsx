import { useEffect, useState } from 'react';
import { Loader2, WifiOff } from 'lucide-react';
import logo from '@/assets/logo.png';

import { initDatabase } from '@/services/database';
import { tieneInternet, sincronizarProductos } from '@/services/sync';
import { obtenerProductosLocales } from '@/services/productosLocal';
import { Button } from '@/components/ui/button';
import { logger } from '@/services/logger';
import { useApp } from '@/context/AppContext';

interface SplashScreenProps {
    onReady: () => void;
}

export function SplashScreen({ onReady }: SplashScreenProps) {
    const [status, setStatus] = useState('Inicializando sistema…');
    const [error, setError] = useState<string | null>(null);
    const { actualizarUltimaSync } = useApp();

    useEffect(() => {
        // escuchar logs
        const unsubscribe = logger.subscribe(log => {
            setStatus(log.message);
        });

        return unsubscribe;
    }, []);
    
    useEffect(() => {
        iniciar();
    }, []);

    const iniciar = async () => {
        try {
            setStatus('Inicializando base de datos…');
            await initDatabase();

            setStatus('Verificando datos locales…');
            const locales = await obtenerProductosLocales();

            const hayLocales = locales.length > 0;
            const hayInternet = await tieneInternet();

            // ❌ caso único donde NO se puede entrar
            if (!hayLocales && !hayInternet) {
                setError(
                    'Se requiere conexión a internet para la primera sincronización'
                );
                return;
            }

            // ✅ si hay internet, se intenta sincronizar SIEMPRE
            if (hayInternet) {
                try {
                    setStatus('Sincronizando productos con la nube…');
                    await sincronizarProductos();
                    actualizarUltimaSync();
                } catch (syncError) {
                    console.warn('⚠️ Sync falló, usando datos locales', syncError);
                    // NO bloquea la app
                }
            } else {
                setStatus('Modo offline');
            }

            // pequeño delay para evitar flash
            setTimeout(() => {
                onReady();
            }, 600);

        } catch (err) {
            console.error(err);
            setError('Error inicializando la aplicación');
        }
    };


    return (
        <div
            className="
        min-h-screen flex flex-col items-center justify-center
        bg-gradient-to-b from-orange-50 via-white to-slate-100
        dark:from-background dark:to-background
      "
        >
            {/* Marca */}
            <div className="flex flex-col items-center mb-20 animate-in fade-in duration-700">
                <img
                    src={logo}
                    alt="POS"
                    className="w-32 h-32 object-contain mb-6"
                />

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground">
                    POS
                </h1>

                <p className="text-base text-slate-500 dark:text-muted-foreground mt-1">
                    Punto de venta
                </p>
            </div>

            {/* Estado */}
            {error ? (
                <div className="flex flex-col items-center gap-4 text-center px-6">
                    <WifiOff className="h-10 w-10 text-red-500" />
                    <p className="text-red-600 font-medium">
                        {error}
                    </p>
                    <p className="text-sm text-slate-500">
                        Conectá el dispositivo a internet e intentá nuevamente
                    </p>
                    <Button
                        className="w-full h-16 text-xl font-bold"
                        size="lg"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 animate-in fade-in delay-300">
                    <Loader2 className="h-10 w-10 animate-spin text-[#f07d19]" />
                    <p className="text-sm text-slate-400 dark:text-muted-foreground">
                        {status}
                    </p>
                </div>
            )}
        </div>
    );
}
