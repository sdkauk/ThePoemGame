"use client";

import Button from "@/components/Button/Button";
import Container from "@/components/Container/container";
import React, { useState } from "react";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div>
      <header>
        <Container>
          <div>
            <h1>The Poem Game</h1>
            <div>
              <Button onClick={onLogout}>Logout</Button>
            </div>
          </div>
        </Container>
      </header>
    </div>
  );
}
