import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { initDatabase } from '@/services/database';
import { sincronizarProductos, tieneInternet, iniciarSyncAutomatico, detenerSyncAutomatico } from '@/services/sync';
import { limpiarProductos, obtenerProductosLocales } from '@/services/productosLocal';
import type { Producto } from '@/data/productos';
export function TestSync() {
  const [logs, setLogs] = useState<string[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [internet, setInternet] = useState<boolean | null>(null);
  const [syncActivo, setSyncActivo] = useState(false);

  const addLog = (mensaje: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${mensaje}`, ...prev]);
    console.log(mensaje);
  };

  useEffect(() => {
    inicializar();

    // Cleanup al desmontar
    return () => {
      detenerSyncAutomatico();
    };
  }, []);

  const inicializar = async () => {
    try {
      setLoading(true);
      addLog('🚀 Iniciando aplicación...');

      // Chequear internet
      const hayInternet = await tieneInternet();
      setInternet(hayInternet);
      addLog(`📡 Internet: ${hayInternet ? 'CONECTADO' : 'SIN CONEXIÓN'}`);

      // Inicializar SQLite
      addLog('💾 Inicializando SQLite...');
      await initDatabase();
      addLog('✅ SQLite inicializado correctamente');

      // Ver cuántos productos hay en local
      const locales = await obtenerProductosLocales();
      addLog(`📦 Productos en SQLite local: ${locales.length}`);

      if (locales.length > 0) {
        setProductos(locales.slice(0, 10));
        addLog('✅ Mostrando productos locales');
      }

      // Intentar sincronizar
      if (hayInternet) {
        addLog('🔄 Iniciando sincronización con servidor...');
        const sincronizado = await sincronizarProductos();

        if (sincronizado) {
          const actualizados = await obtenerProductosLocales();
          addLog(`✅ Sincronización exitosa: ${actualizados.length} productos`);
          setProductos(actualizados.slice(0, 10));
        } else {
          addLog('⚠️ Sincronización falló');
        }
      } else {
        addLog('⚠️ Sin internet, usando datos locales');
      }

      addLog('🎉 Inicialización completa');

    } catch (err) {
      addLog(`❌ ERROR: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      addLog('🔄 Sincronización manual iniciada...');

      const hayInternet = await tieneInternet();
      setInternet(hayInternet);
      addLog(`📡 Internet: ${hayInternet ? 'CONECTADO' : 'SIN CONEXIÓN'}`);

      if (!hayInternet) {
        addLog('⚠️ Sin conexión, no se puede sincronizar');
        return;
      }

      const sincronizado = await sincronizarProductos();

      if (sincronizado) {
        const actualizados = await obtenerProductosLocales();
        setProductos(actualizados.slice(0, 10));
        addLog(`✅ Sincronización exitosa: ${actualizados.length} productos`);
      } else {
        addLog('❌ Sincronización falló');
      }

    } catch (err) {
      addLog(`❌ ERROR en refresh: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarLogs = () => {
    setLogs([]);
    addLog('🧹 Logs limpiados');
  };

 const toggleSyncAutomatico = () => {
  if (syncActivo) {
    detenerSyncAutomatico();
    setSyncActivo(false);
    addLog('⏹️ Sync automático detenido');
  } else {
    // Pasar callback para actualizar productos
    iniciarSyncAutomatico(1, (productosActualizados) => {
      setProductos(productosActualizados.slice(0, 10));
      addLog(`📦 UI actualizada: ${productosActualizados.length} productos`);
    });
    setSyncActivo(true);
    addLog('▶️ Sync automático iniciado (cada 2 minutos)');
  }
};

  const borrarBdLocal = async () => {
    await limpiarProductos()
    setLogs([]);
    addLog('🧹 BD LOCAL BORRADA');
    setProductos([])
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                🧪 Test Sincronización
              </CardTitle>
              <div className="flex items-center gap-2">
                {internet === null ? (
                  <Badge variant="outline">Chequeando...</Badge>
                ) : internet ? (
                  <Badge className="bg-green-500">
                    <Wifi className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <WifiOff className="h-3 w-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={limpiarLogs}
                variant="outline"
                className="w-full"
              >
                🧹 Limpiar Logs
              </Button>
              <Button
                onClick={borrarBdLocal}
                variant="outline"
                className="w-full"
              >
                BORRAR BD LOCAL
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Sincronizar Manual
              </Button>
              <Button
                onClick={toggleSyncAutomatico}
                variant={syncActivo ? "destructive" : "default"}
                className="w-full"
              >
                {syncActivo ? '⏹️ Detener' : '▶️ Iniciar'} Sync Auto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📋 Logs de Actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-slate-500">No hay logs aún...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📦 Primeros 10 Productos
              <Badge variant="secondary">{productos.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productos.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No hay productos cargados
              </p>
            ) : (
              <div className="space-y-2">
                {productos.map((p) => (
                  <div
                    key={p.no_plu}
                    className="flex items-center justify-between p-3 bg-slate-100 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-sm">{p.c_plu}</p>
                      <p className="text-xs text-slate-600">PLU: {p.no_plu}</p>
                    </div>
                    <Badge variant="secondary">
                      ${p.p_venta.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}