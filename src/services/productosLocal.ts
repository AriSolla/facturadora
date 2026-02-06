import type { Producto } from '@/data/productos';
import { getDatabase } from './database';
import { logger } from './logger';

// Guardar múltiples productos (sync desde servidor)
export async function guardarProductos(productos: Producto[]): Promise<void> {
  const db = getDatabase();
  
  try {
    // Usar executeSet en lugar de transacciones manuales
    const statements = productos.map(p => ({
      statement: `INSERT OR REPLACE INTO productos 
        (no_plu, c_plu, c_desc, no_dept, n_iva, n_tasa, no_unid, q_unidad, p_venta, p_oferta, tModi) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values: [p.no_plu, p.c_plu, p.c_desc, p.no_dept, p.n_iva, p.n_tasa, p.no_unid, p.q_unidad, p.p_venta, p.p_oferta, p.tModi]
    }));
    
    await db.executeSet(statements);
    logger.info(`✅ ${productos.length} productos guardados en SQLite`);
  } catch (error) {
    alert('❌ Error guardando productos: '+error);
    throw error;
  }
}

// Obtener todos los productos locales
export async function obtenerProductosLocales(): Promise<Producto[]> {
  const db = getDatabase();
  
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY no_plu ASC');
    
    if (!result || !result.values) {
      return [];
    }
    
    return result.values.map((row: any) => ({
      no_plu: row.no_plu,
      c_plu: row.c_plu,
      c_desc: row.c_desc,
      no_dept: row.no_dept,
      n_iva: row.n_iva,
      n_tasa: row.n_tasa,
      no_unid: row.no_unid,
      q_unidad: row.q_unidad,
      p_venta: row.p_venta,
      p_oferta: row.p_oferta,
      tModi: row.tModi
    }));
  } catch (error) {
    console.error('❌ Error obteniendo productos locales:', error);
    throw error;
  }
}

// Buscar producto por código (para el scanner)
export async function buscarProductoLocal(codigo: string): Promise<Producto | null> {
  const db = getDatabase();
  
  try {
    const result = await db.query(
      'SELECT * FROM productos WHERE no_plu = ? LIMIT 1',
      [codigo]
    );
    
    if (!result || !result.values || result.values.length === 0) {
      return null;
    }
    
    const row = result.values[0];
    return {
      no_plu: row.no_plu,
      c_plu: row.c_plu,
      c_desc: row.c_desc,
      no_dept: row.no_dept,
      n_iva: row.n_iva,
      n_tasa: row.n_tasa,
      no_unid: row.no_unid,
      q_unidad: row.q_unidad,
      p_venta: row.p_venta,
      p_oferta: row.p_oferta,
      tModi: row.tModi
    };
  } catch (error) {
    console.error('❌ Error buscando producto local:', error);
    throw error;
  }
}

// Limpiar todos los productos (útil para re-sync completo)
export async function limpiarProductos(): Promise<void> {
  const db = getDatabase();
  
  try {
    await db.execute('DELETE FROM productos');
    console.log('✅ Productos locales eliminados');
  } catch (error) {
    console.error('❌ Error limpiando productos:', error);
    throw error;
  }
}