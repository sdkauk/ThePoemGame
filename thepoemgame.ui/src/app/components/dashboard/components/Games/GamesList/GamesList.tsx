import React from "react";
import styles from "./GamesList.module.css";
import { Game } from "@/services/gameService";
import GameCard from "../GameCard/GameCard";
import Grid from "@/components/Grid/grid";

interface GamesListProps {
  games: Game[];
  onGameJoined?: () => void;
  onGameLeft?: () => void;
  currentUserId?: string;
}

const GamesList: React.FC<GamesListProps> = ({
  games,
  onGameJoined,
  onGameLeft,
  currentUserId,
}) => {
  return (
    <div className={styles.gamesList}>
      <Grid cols={1} gap="md">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onGameJoined={onGameJoined}
            onGameLeft={onGameLeft}
            currentUserId={currentUserId}
          />
        ))}
      </Grid>
    </div>
  );
};

export default GamesList;
