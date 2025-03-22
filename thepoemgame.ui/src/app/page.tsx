"use client";

import { useAuth } from "@/auth/use-auth";
import Button from "@/components/Button/Button";
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import LandingPage from "./components/landing-page/landing-page";
import Dashboard from "./components/dashboard/dashboard";
import Navbar from "@/components/Navbar/Navbar";
import UserMenu from "@/components/Navbar/UserMenu/UserMenu";
import NavItem from "@/components/Navbar/NavItem/NavItem";

export default function Home() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const { inProgress } = useMsal();
  const loading = inProgress !== InteractionStatus.None;

  return (
    <div className="min-h-screen flex flex-col">
      {loading ? (
        <p className="text-center">Loading authentication state...</p>
      ) : isAuthenticated ? (
        <>
          <Navbar
            fixed={false}
            maxWidth="full"
            logo={
              <h1 className="text-2xl font-bold text-purple-800">
                The Poem Game
              </h1>
            }
            actions={
              <UserMenu name={user?.name || "User"}>
                <div>
                  <NavItem href="/profile">Profile</NavItem>
                  <NavItem href="/settings">Settings</NavItem>
                  <NavItem onClick={logout}>Logout</NavItem>
                </div>
              </UserMenu>
            }
          >
            <NavItem href="/" active>
              Home
            </NavItem>
          </Navbar>

          <main className="flex-1">
            <Dashboard onLogout={logout} user={user} />
          </main>
        </>
      ) : (
        <LandingPage onLogin={login} onSignUp={login} />
      )}
    </div>
  );
}
