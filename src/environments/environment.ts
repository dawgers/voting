// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  /*
   * In development mode, for easier debugging, you can ignore zone related error
   * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
   * below file. Don't forget to comment it out in production mode
   * because it will have a performance impact when errors are thrown
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

  apiUrl: 'http://localhost:8000/VC/',
  
  mapbox: {
    accessToken: 'pk.eyJ1IjoiaGFtbWFkYnV0dCIsImEiOiJjbHZkazlwYjEwZ3FmMnJwNjBrMGt2c3VoIn0.mct9k_iVeCJUevZq8LiJyw'
  }

};
