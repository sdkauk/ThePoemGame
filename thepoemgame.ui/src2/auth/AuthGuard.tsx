// auth/AuthGuard.tsx
'use client';

import { useMsal, UnauthenticatedTemplate, AuthenticatedTemplate } from "@azure/msal-react";
import { useEffect } from "react";
import { loginRedirectRequest } from "./msalConfig";
import { InteractionStatus } from "@azure/msal-browser";

// For pages that should only be accessible when logged in
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { instance, inProgress, accounts } = useMsal();
  
  useEffect(() => {
    // If no users are signed in and the interaction is complete, redirect to login
    if (accounts.length === 0 && inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRedirectRequest).catch(e => {
        console.error("Login redirect failed", e);
      });
    }
  }, [accounts, inProgress, instance]);

  // Show loading or children based on authentication status
  return (
    <>
      <AuthenticatedTemplate>
        {children}
      </AuthenticatedTemplate>
      
      <UnauthenticatedTemplate>
        <div className="flex items-center justify-center min-h-screen">
          <p>Please wait while we redirect you to login...</p>
        </div>
      </UnauthenticatedTemplate>
    </>
  );
};

// For pages that should only be accessible when logged out
export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <UnauthenticatedTemplate>
        {children}
      </UnauthenticatedTemplate>
      
      <AuthenticatedTemplate>
        <div className="flex items-center justify-center min-h-screen">
          <p>You are already logged in. Redirecting...</p>
        </div>
      </AuthenticatedTemplate>
    </>
  );
};