// auth/MsalProvider.tsx
'use client';

import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { MsalProvider as DefaultMsalProvider } from "@azure/msal-react";
import { msalConfig } from "./msalConfig";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// We'll ensure initialization in the component
export const MsalProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize the MSAL instance first
    const initializeMsal = async () => {
      await msalInstance.initialize();
      
      // Once initialized, set active account if available
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
      
      // Register event callback after initialization
      msalInstance.addEventCallback((event: EventMessage) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as AuthenticationResult;
          const account = payload.account;
          msalInstance.setActiveAccount(account);
        }
      });
      
      // Now handle any pending redirect
      try {
        await msalInstance.handleRedirectPromise();
      } catch (error) {
        console.error("Redirect error: ", error);
      }
      
      setIsInitialized(true);
    };
    
    initializeMsal();
  }, [router]);

  if (!isInitialized) {
    return <div>Initializing authentication...</div>;
  }

  return (
    <DefaultMsalProvider instance={msalInstance}>
      {children}
    </DefaultMsalProvider>
  );
};