import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rti.facturador',
  appName: 'facturador-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
