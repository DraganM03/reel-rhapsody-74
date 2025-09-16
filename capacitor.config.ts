import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.94ce3ba5180b4c5497f0518222a8cebd',
  appName: 'reel-rhapsody-74',
  webDir: 'dist',
  server: {
    url: 'https://94ce3ba5-180b-4c54-97f0-518222a8cebd.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;