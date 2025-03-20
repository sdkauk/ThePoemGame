"use client";

import { useAuth } from "@/auth/use-auth";
import Button from "@/components/Button/Button";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import LandingPage from "./components/landing-page/landing-page";
import Dashboard from "./components/dashboard/dashboard";

export default function Home() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const { inProgress } = useMsal();
  const loading = inProgress !== InteractionStatus.None;

  return (
    <div>
      {loading ? (
        <p className="text-center">Loading authentication state...</p>
      ) : isAuthenticated ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <LandingPage onLogin={login} onSignUp={login} />
      )}
    </div>
  );
}
