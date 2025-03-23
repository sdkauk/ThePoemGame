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
        <Container>
          <Grid cols={12} gap="md">
            <Column span={12} md={6} lg={4}>
              <GroupsSection />
            </Column>
            <Column span={12} md={12} lg={6}>
              <PoemsSection />
            </Column>
          </Grid>
        </Container>
      </header>
    </div>
  );
}
