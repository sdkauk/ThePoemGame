"use client";

import Button from "@/components/Button/Button";
import Container from "@/components/Container/container";
import React, { useState } from "react";
import GroupList from "./components/Groups/GroupList/GroupList";
import GroupsSection from "./components/Groups/GroupsSection/GroupsSection";
import UserMenu from "@/components/Navbar/UserMenu/UserMenu";
import NavItem from "@/components/Navbar/NavItem/NavItem";
import Navbar from "@/components/Navbar/Navbar";
import PoemsSection from "./components/Poems/PoemsSection/PoemsSection";
import Grid from "@/components/Grid/grid";
import Column from "@/components/Column/column";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  return (
    <div>
      <header>
        <Container maxWidth="xl">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <GroupsSection />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <PoemsSection />
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
}
