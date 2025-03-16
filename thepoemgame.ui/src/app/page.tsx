'use client'

import { AuthGuard } from "@/auth/AuthGuard";
import { useAuth } from "@/auth/use-auth";
import Dashboard from "@/components/Dashboard";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

export default function Home() {

  const { isAuthenticated, login, logout, user } = useAuth();
  const { inProgress } = useMsal();
  const loading = inProgress !== InteractionStatus.None;

  return (
    <div>
      <div>
          {loading ? (
            <p>Loading authentication state...</p>
          ) : isAuthenticated ? (
            <div>
<Dashboard/>
              
              <button
                onClick={() => logout()}
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => login()}
            >
              Log In with Azure AD B2C
            </button>
          )}
        </div>
    </div>
  );
}