import React, { useState, useEffect } from "react";
import styles from "./GameCard.module.css";
import {
  Game,
  GameStatus,
  GamePhase,
  gameService,
} from "@/services/gameService";
import Card from "@/components/Card/card";
import Button from "@/components/Button/Button";
import { userService } from "@/services/userService";

interface GameCardProps {
  game: Game;
  onGameJoined?: () => void;
  onGameLeft?: () => void;
  currentUserId?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onGameJoined,
  onGameLeft,
}) => {
  const [isUserInGame, setIsUserInGame] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkGameMembership = async () => {
      try {
        setLoading(true);
        const isInGame = await gameService.isUserInGame(game.id);
        setIsUserInGame(isInGame);
      } catch (error) {
        console.error("Failed to check game membership:", error);
      } finally {
        setLoading(false);
      }
    };

    checkGameMembership();
  }, [game.id]);

  // Determine if the user can join based on game status, players count, and membership
  const canJoin =
    !loading &&
    !isUserInGame &&
    game.status === GameStatus.WaitingForPlayers &&
    game.players.length < game.maxPlayers;

  const canLeave =
    !loading && isUserInGame && game.status === GameStatus.WaitingForPlayers;

  const canStart =
    !loading &&
    isUserInGame &&
    game.status === GameStatus.WaitingForPlayers &&
    game.players.length >= 2;

  const handleJoinGame = async () => {
    try {
      await userService.joinGameById(game.id);
      setIsUserInGame(true);
      if (onGameJoined) {
        onGameJoined();
      }
    } catch (error) {
      console.error("Failed to join game:", error);
    }
  };

  const handleLeaveGame = async () => {
    try {
      await userService.leaveGame(game.id);
      setIsUserInGame(false);
      if (onGameLeft) {
        onGameLeft();
      }
    } catch (error) {
      console.error("Failed to leave game:", error);
    }
  };

  const handleStartGame = async () => {
    try {
      await gameService.startGame(game.id);
      if (onGameJoined) {
        onGameJoined();
      }
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  const getGameStatusText = (status: GameStatus) => {
    switch (status) {
      case GameStatus.WaitingForPlayers:
        return "Waiting for Players";
      case GameStatus.InProgress:
        return "In Progress";
      case GameStatus.Completed:
        return "Completed";
      case GameStatus.Cancelled:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getGamePhaseText = (phase: GamePhase) => {
    switch (phase) {
      case GamePhase.CreatePoems:
        return "Creating Poems";
      case GamePhase.RoundRobin:
        return "Round Robin";
      case GamePhase.Exhibit:
        return "Exhibit";
      case GamePhase.Awards:
        return "Awards";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className={styles.gameCard}>
      <div className={styles.gameHeader}>
        <h3 className={styles.gameTitle}>
          {game.name || `Game #${game.id.substring(0, 8)}`}
        </h3>
        <div className={styles.gameStatus}>
          {getGameStatusText(game.status)}
          {game.status === GameStatus.InProgress && (
            <span className={styles.gamePhase}>
              {" "}
              ({getGamePhaseText(game.phase)})
            </span>
          )}
        </div>
      </div>

      <div className={styles.gameMeta}>
        <div className={styles.gameDetail}>
          <span className={styles.label}>Players:</span>
          <span>
            {game.players.length} / {game.maxPlayers}
          </span>
        </div>
        <div className={styles.gameDetail}>
          <span className={styles.label}>Lines per poem:</span>
          <span>{game.linesPerPoem}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            window.location.href = `/game/${game.id}`;
          }}
        >
          View Game
        </Button>

        {canJoin && (
          <Button variant="secondary" size="sm" onClick={handleJoinGame}>
            Join Game
          </Button>
        )}

        {canLeave && (
          <Button variant="outline" size="sm" onClick={handleLeaveGame}>
            Leave Game
          </Button>
        )}

        {canStart && (
          <Button variant="secondary" size="sm" onClick={handleStartGame}>
            Start Game
          </Button>
        )}
      </div>
    </Card>
  );
};

export default GameCard;
