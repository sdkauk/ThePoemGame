'use client'

import { AuthGuard } from "@/auth/AuthGuard";
import { useAuth } from "@/auth/use-auth";
import Dashboard from "@/components/Dashboard";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import Image from "next/image";

export default function Home() {

  const { isAuthenticated, login, logout, user } = useAuth();
  const { inProgress } = useMsal();
  const loading = inProgress !== InteractionStatus.None;

  return (
    <div>
      <AuthGuard><Dashboard/></AuthGuard>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
          {loading ? (
            <p className="text-center">Loading authentication state...</p>
          ) : isAuthenticated ? (
            <div>
              <div className="mb-4 p-4 border rounded bg-gray-50">
                <h2 className="font-bold text-lg mb-2">User Information</h2>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.idTokenClaims?.emails?.[0]}</p>
              </div>
              
              <button
                onClick={() => logout()}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => login()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Log In with Azure AD B2C
            </button>
          )}
        </div>
    </div>

  );
}
