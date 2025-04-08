// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false, appScheme: 'com.yourcompany.snackify',
  // apiUrl: 'https://restaurant-api.runasp.net/api',// Update with your production API base URL
  imageUrl: 'https://localhost:7048/images/',
  apiUrl: 'https://localhost:7048/api',// Update with your production API base URL
  // apiUrl: 'https://restaurant-api.runasp.net/api',
  // imageUrl: 'https://restaurant-api.runasp.net/images/',
  firebaseConfig: {
    apiKey: "AIzaSyBIIyWvQ5VW3flUpG3ri9-LwHGc0mAivMc",
    authDomain: "aanandam-snackify.firebaseapp.com",
    projectId: "aanandam-snackify",
    storageBucket: "aanandam-snackify.firebasestorage.app",
    messagingSenderId: "333096962759",
    appId: "1:333096962759:web:3625fbbef77f5c23570ce2",
    measurementId: "G-MEHGXQBTH2"
  },
  CountryJson: [
    { name: 'India', dial_code: '+91', code: 'IN' },
    { name: 'Pakistan', dial_code: '+92', code: 'PK' }
  ],
  googleMapsApiKey: 'AIzaSyAk3Dm_CW2tcMaObQo6_4PerU_xRQTnWd0',

  cashfreeAppId: 'TEST10485044b7d655bf67a03ac0488244058401',
  cashfreeStagingUrl: 'https://sandbox.cashfree.com/pg',
  cashfreeProdUrl: 'https://api.cashfree.com/pg'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
