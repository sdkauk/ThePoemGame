// auth/useAuth.ts
'use client';

import { useState, useEffect, useCallback } from "react";
import { useMsal, useAccount } from "@azure/msal-react";
import { InteractionStatus, AccountInfo } from "@azure/msal-browser";
import { loginRequest, loginRedirectRequest, b2cPolicies, msalConfig } from "./msalConfig";

export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<AccountInfo | null>(null);

  useEffect(() => {
    if (account && accounts.length > 0) {
      setIsAuthenticated(true);
      setUserData(account);
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, [account, accounts]);

  const login = useCallback(async () => {
    if (inProgress === InteractionStatus.None) {
      try {
        await instance.loginRedirect(loginRedirectRequest);
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  }, [instance, inProgress]);

  const logout = useCallback(() => {
    instance.logoutRedirect();
  }, [instance]);

  const resetPassword = useCallback(() => {
    const resetPasswordRequest = {
      ...loginRedirectRequest,
      authority: msalConfig.auth.authority?.replace(
        b2cPolicies.signUpSignIn,
        b2cPolicies.resetPassword
      )
    };
    
    instance.loginRedirect(resetPasswordRequest);
  }, [instance]);

  const editProfile = useCallback(() => {
    const editProfileRequest = {
      ...loginRedirectRequest,
      authority: msalConfig.auth.authority?.replace(
        b2cPolicies.signUpSignIn,
        b2cPolicies.editProfile
      )
    };
    
    instance.loginRedirect(editProfileRequest);
  }, [instance]);

// Fix the getAccessToken function
const getAccessToken = useCallback(async () => {
  if (account) {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      });
      return response.accessToken;
    } catch (error) {
      // Use popup instead of redirect to get the response
      try {
        const response = await instance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      } catch (err) {
        console.error("Failed to acquire token", err);
        return null;
      }
    }
  }
  return null;
}, [instance, account]);

  return {
    isAuthenticated,
    login,
    logout,
    resetPassword,
    editProfile,
    getAccessToken,
    user: userData,
    inProgress
  };
}