'use client'

import { useAuth } from "@/auth/use-auth";
import Button from "@/components/Button/Button";
import Dashboard from "@/components/Dashboard/Dashboard";
import Header from "@/components/Header/Header";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

export default function Home() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const { inProgress } = useMsal();
  const loading = inProgress !== InteractionStatus.None;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {loading ? (
          <p className="text-center">Loading authentication state...</p>
        ) : isAuthenticated ? (
          <div className="flex flex-col items-center space-y-8">
            <Header />
            <Dashboard />
            <Button onClick={() => logout()}>
              Log Out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-8">
            <Header />
            <Button onClick={() => login()}>
              Log In
            </Button>
            <Button onClick={() => login()}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}