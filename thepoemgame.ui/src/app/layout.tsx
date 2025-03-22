// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MsalWrapper from "@/components/MsalWrapper/MsalWrapper";
import Navbar from "@/components/Navbar/Navbar";
import UserMenu from "@/components/Navbar/UserMenu/UserMenu";
import NavItem from "@/components/Navbar/NavItem/NavItem";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Azure B2C App",
  description: "Application with Azure AD B2C Authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MsalWrapper>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </MsalWrapper>
      </body>
    </html>
  );
}
