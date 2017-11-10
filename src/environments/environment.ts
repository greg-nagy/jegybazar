// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    baseUrl: 'https://jegybazar-27302.firebaseio.com',
    registrationUrl: ' https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser',
    loginUrl: ' https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword',
    apiKey: 'AIzaSyALPBS-gllA6F-vRya-6pYZXABheOWFYlw',
    authDomain: 'jegybazar-27302.firebaseapp.com',
    databaseURL: 'https://jegybazar-27302.firebaseio.com',
    projectId: 'jegybazar-27302',
    storageBucket: 'jegybazar-27302.appspot.com',
    messagingSenderId: '873164960496'
  }
};
