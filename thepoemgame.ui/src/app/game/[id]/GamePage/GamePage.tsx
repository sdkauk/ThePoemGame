"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Game, GamePhase, gameService } from "@/services/gameService";
import { WaitingPoem, poemService } from "@/services/poemService";
import Container from "@/components/Container/container";
import LinedPaper from "../LinedPaper/LinedPaper";
import PoemCarousel from "../PoemCarousel/PoemCarousel";
import RoundRobinPhase from "../RoundRobinPhase/RoundRobinPhase";
import CreatePoemsPhase from "../CreatePoemsPhase/CreatePoemsPhase";
import ExhibitionPhase from "../ExhibitionPhase/ExhibitionPhase";
import Navbar from "@/components/Navbar/Navbar";
import NavItem from "@/components/Navbar/NavItem/NavItem";
import Button from "@/components/Button/Button";

export default function GamePage() {
  const params = useParams();
  const gameId = params?.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitingPoems, setWaitingPoems] = useState<WaitingPoem[]>([]);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);

  useEffect(() => {
    async function fetchGameData() {
      try {
        setLoading(true);
        if (!gameId) return;

        // Load game data
        const gameData = await gameService.getGame(gameId);
        setGame(gameData);

        // Load poems waiting for user contribution
        const poems = await poemService.getUserWaitingPoems();
        const gamePendingPoems = poems.filter((poem) => poem.gameId === gameId);
        setWaitingPoems(gamePendingPoems);

        setError(null);
      } catch (err) {
        console.error("Error loading game:", err);
        setError("Failed to load game data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [gameId]);

  const handleNextPoem = () => {
    if (waitingPoems.length <= 1) return;
    setCurrentPoemIndex((prev) => (prev + 1) % waitingPoems.length);
  };

  const handlePrevPoem = () => {
    if (waitingPoems.length <= 1) return;
    setCurrentPoemIndex(
      (prev) => (prev - 1 + waitingPoems.length) % waitingPoems.length
    );
  };

  const handlePoemCreated = async () => {
    // // Reload game data to reflect new state
    // try {
    //   setLoading(true);
    //   const gameData = await gameService.getGame(gameId);
    //   setGame(gameData);
    // } catch (err) {
    //   console.error("Error refreshing game data:", err);
    // } finally {
    //   setLoading(false);
    // }
    // setShowPoemSuccess(true);
  };

  const renderGameContent = () => {
    if (loading) return <div>Loading game...</div>;
    if (error) return <div>{error}</div>;
    if (!game) return <div>Game not found</div>;

    switch (game.phase) {
      case GamePhase.CreatePoems:
        return (
          // <CreatePoemsPhase game={game} onPoemCreated={handlePoemCreated} />
          <CreatePoemsPhase game={game} onPoemCreated={handlePoemCreated} />
        );
      case GamePhase.RoundRobin:
        return (
          <RoundRobinPhase
            game={game}
            waitingPoems={waitingPoems}
            currentPoemIndex={currentPoemIndex}
            onNextPoem={handleNextPoem}
            onPrevPoem={handlePrevPoem}
          />
        );
      case GamePhase.Exhibit:
        return <ExhibitionPhase game={game} />;
      default:
        return <div>This game phase is not yet implemented</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8">
        <Container>{renderGameContent()}</Container>
      </main>
    </div>
  );
}
