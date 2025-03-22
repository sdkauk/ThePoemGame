"use client";

import Button from "@/components/Button/Button";
import Container from "@/components/Container/container";
import React, { useState } from "react";
import GroupList from "./components/Groups/GroupList/GroupList";
import GroupsSection from "./components/Groups/GroupsSection/GroupsSection";
import UserMenu from "@/components/Navbar/UserMenu/UserMenu";
import NavItem from "@/components/Navbar/NavItem/NavItem";
import Navbar from "@/components/Navbar/Navbar";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [showCreateGameModal, setShowCreateGameModal] = useState(false);
  return (
    <div>
      <header>
        <Container>
          <div>
            <div>
              <GroupsSection />
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
}
