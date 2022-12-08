/* eslint-disable @typescript-eslint/naming-convention */
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ura.peekus',
  appName: 'Peekus',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: { //ic_stat_icon_config_sample
      smallIcon: 'ic_launcher_round',
      iconColor: '#A0E4B0',
      // sound: 'beep.wav',
    },
  },
};

export default config;
