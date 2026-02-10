import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

let sqliteConnection: SQLiteConnection;
let db: SQLiteDBConnection | null = null;

const DB_NAME = 'homapos.db';
const isNative = Capacitor.isNativePlatform();

export async function initDatabase(): Promise<void> {
  try {
    if (!isNative) {
      console.log('🌐 Modo web: SQLite deshabilitado');
      return;
    }
    // Inicializar la conexión SQLite
    sqliteConnection = new SQLiteConnection(CapacitorSQLite);

    // Crear/abrir la base de datos
    const ret = await sqliteConnection.checkConnectionsConsistency();
    const isConn = (await sqliteConnection.isConnection(DB_NAME, false)).result;

    if (ret.result && isConn) {
      db = await sqliteConnection.retrieveConnection(DB_NAME, false);
    } else {
      db = await sqliteConnection.createConnection(DB_NAME, false, 'no-encryption', 1, false);
    }

    await db.open();

    // Crear tabla de productos si no existe
    await db.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        no_plu TEXT PRIMARY KEY,
        c_plu TEXT NOT NULL,
        c_desc TEXT,
        no_dept INTEGER,
        n_iva INTEGER,
        n_tasa REAL,
        no_unid TEXT,
        q_unidad REAL,
        p_venta REAL,
        p_oferta REAL,
        tModi TEXT
      );
    `);

    console.log('✅ Base de datos inicializada');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (!isNative || !db) return;
  
  await sqliteConnection.closeConnection(DB_NAME, false);
  db = null;
}

export function getDatabase(): SQLiteDBConnection {
  if (!isNative) {
    throw new Error('SQLite solo disponible en Android');
  }
  if (!db) {
    throw new Error('Base de datos no inicializada');
  }
  return db;
}

export function isDatabaseAvailable(): boolean {
  return isNative;
}