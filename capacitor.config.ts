import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.crewcanv1',
  appName: 'crewcanV1',
  webDir: 'dist/crewcanV1/browser',
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    },
    EdgeToEdge: {
      enabled: true,
      backgroundColor: '#ffffff'
    }
  }
};

export default config;
