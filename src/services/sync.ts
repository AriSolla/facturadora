import type { Producto } from '@/data/productos';
import { getProductos } from './productos';
import { guardarProductos, obtenerProductosLocales } from './productosLocal';
import { Network } from '@capacitor/network';
import { logger } from './logger';

// Verificar si hay conexión a internet
export async function tieneInternet(): Promise<boolean> {
  try {
    const status = await Network.getStatus();
    return status.connected;
  } catch (error) {
    console.error('Error chequeando conexión:', error);
    return false;
  }
}

// Sincronizar productos desde el servidor
export async function sincronizarProductos(): Promise<Producto[]> {
  try {
    const hayInternet = await tieneInternet();
    
    if (!hayInternet) {
      logger.info('⚠️ Sin internet, usando datos locales');
      return await obtenerProductosLocales();
    }
    
    logger.info('🔄 Sincronizando productos desde servidor...');
    
    const productosServidor = await getProductos();
    await guardarProductos(productosServidor);
    
    logger.info(`✅ Sincronización completa: ${productosServidor.length} productos`);
    
    // Retornar productos actualizados
    return await obtenerProductosLocales();
    
  } catch (error) {
    alert('❌ Error en sincronización: ' +error);
    // En caso de error, retornar lo que hay local
    return await obtenerProductosLocales();
  }
}

// Cargar productos (local primero, luego sync)
export async function cargarProductos() {
  try {
    // 1. Intentar cargar desde local (rápido)
    const locales = await obtenerProductosLocales();
    
    // 2. Sincronizar en background
    const sincronizado = await sincronizarProductos();
    
    // 3. Si sincronizó, traer datos actualizados
    if (sincronizado) {
      return await obtenerProductosLocales();
    }
    
    // 4. Si no sincronizó, retornar datos locales
    return locales;
    
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    throw error;
  }
}

// Intervalo de sincronización automática
let syncInterval: number | null = null;
// Iniciar sincronización automática cada X minutos
export function iniciarSyncAutomatico(
  minutos: number = 1, 
  onSync?: (productos: Producto[]) => void
): void {
  detenerSyncAutomatico();
  
  alert(`🔄 Sync automático iniciado (cada ${minutos} minutos)`);
  
  // Primera sync
  sincronizarProductos().then(productos => {
    if (onSync) onSync(productos);
  });
  
  // Syncs periódicas
  syncInterval = setInterval(async () => {
    alert('⏰ Ejecutando sync automático...');
    
    const hayInternet = await tieneInternet();
    if (hayInternet) {
      const productos = await sincronizarProductos();
      if (onSync) onSync(productos);
    } else {
      alert('⚠️ Sync automático: Sin internet, saltando...');
    }
  }, minutos * 60 * 1000);
}

// Detener sincronización automática
export function detenerSyncAutomatico(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    alert('⏹️ Sync automático detenido');
  }
}

// Verificar si el sync automático está activo
export function estaActivoSyncAutomatico(): boolean {
  return syncInterval !== null;
}