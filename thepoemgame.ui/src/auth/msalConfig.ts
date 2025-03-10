// auth/msalConfig.ts
import { Configuration, LogLevel, RedirectRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: "9da2bd40-7f43-4616-bb00-b4e22188616b", // From your appsettings.json
    authority: "https://thepoemgameauth.b2clogin.com/thepoemgameauth.onmicrosoft.com/B2C_1_susi", // Combine instance, domain and signInPolicy
    knownAuthorities: ["thepoemgameauth.b2clogin.com"], // Your b2clogin domain
    redirectUri: "http://localhost:3000/", // Will redirect back to the app after login
    postLogoutRedirectUri: "/" // Will redirect after logout
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
    storeAuthStateInCookie: false // Set this to "true" if you're having issues with IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      }
    }
  }
};

// Login request object
export const loginRequest = {
  scopes: ["openid", "profile", "offline_access", "https://ThePoemGameAuth.onmicrosoft.com/85011134-f947-4b26-bde9-247a83e06293/Api.Access"]
};

// Used for initiating login, specifying which policy to use
export const loginRedirectRequest: RedirectRequest = {
  ...loginRequest,
  redirectStartPage: window.location.href
};

// Policies
export const b2cPolicies = {
  signUpSignIn: "B2C_1_susi",
  resetPassword: "B2C_1_reset",
  editProfile: "B2C_1_edit"
};