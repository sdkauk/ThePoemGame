// src/app/game/[id]/page.tsx
"use client";

import React from "react";
import { AuthGuard } from "@/auth/AuthGuard";
import GamePage from "./GamePage/GamePage";

export default function GamePageWrapper() {
  return (
    <AuthGuard>
      <GamePage />
    </AuthGuard>
  );
}
