// // import type { CapacitorConfig } from '@capacitor/cli';

// // const config: CapacitorConfig = {
// //   appId: 'food.snackify',
// //   appName: 'Food-Snackify',
// //   webDir: 'www',
// //   plugins: {
// //     PushNotifications: {
// //       presentationOptions: ["badge", "sound", "alert"],
// //     },
// //     SplashScreen: {
// //       launchFadeOutDuration: 3000,
// //       backgroundColor: "orange",
// //       showSpinner: false,
// //       androidSpinnerStyle: "small",
// //       iosSpinnerStyle: "small",
// //       splashFullScreen: true,
// //       splashImmersive: true,
// //     },
// //   }
// // };

// // export default config;


// import { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'food.snackify',
//   appName: 'Snackify',
//   webDir: 'www',
//   plugins: {
//     SplashScreen: {
//       launchShowDuration: 3000,
//       launchAutoHide: true,
//       backgroundColor: "#e6d0c8",
//       androidSplashResourceName: "splash",
//       androidScaleType: "CENTER_CROP",
//       showSpinner: false,
//       splashFullScreen: true,
//       splashImmersive: true,
//     },
//     StatusBar: {
//       overlaysWebView: false
//     }
//   },

// };

// export default config;

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'food.snackify',
  appName: 'Snackify',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      // Remove fixed backgroundColor to allow theme-based colors
      androidScaleType: "FIT_CENTER",
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      launchFadeOutDuration: 500,
    },
    StatusBar: {
      overlaysWebView: false,
      // For theme awareness, remove fixed backgroundColor
      style: "DEFAULT" // This will adapt to light/dark theme
    }
  },
  android: {
    useLegacyBridge: false
  }
};

export default config;