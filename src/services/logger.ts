type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  id: number;
  timestamp: number;
  level: LogLevel;
  message: string;
}

type LogListener = (log: LogEntry) => void;

let logs: LogEntry[] = [];
let listeners: LogListener[] = [];
let idCounter = 0;

const MAX_LOGS = 200;

function addLog(level: LogLevel, message: string) {
  const entry: LogEntry = {
    id: ++idCounter,
    timestamp: Date.now(),
    level,
    message,
  };

  logs.push(entry);

  if (logs.length > MAX_LOGS) {
    logs.shift(); // evita comer memoria
  }

  // consola (para debug)
  if (level === 'error') console.error(message);
  else if (level === 'warn') console.warn(message);
  else console.log(message);

  // notificar subscriptores
  listeners.forEach(l => l(entry));
}

export const logger = {
  info: (msg: string) => addLog('info', msg),
  warn: (msg: string) => addLog('warn', msg),
  error: (msg: string) => addLog('error', msg),

  getLogs: () => [...logs],

  subscribe(listener: LogListener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },

  clear() {
    logs = [];
  },
};
