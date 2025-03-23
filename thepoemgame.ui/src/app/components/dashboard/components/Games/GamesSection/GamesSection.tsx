import React, { useEffect, useState } from "react";
import styles from "./GamesSection.module.css";
import Button from "@/components/Button/Button";
import { Game, gameService } from "@/services/gameService";
import GamesList from "../GamesList/GamesList";
import CreateGameModal from "../CreateGameModal/CreateGameModal";

interface GamesSectionProps {
  user?: any;
}

const GamesSection: React.FC<GamesSectionProps> = ({ user }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const fetchedGames = await gameService.getUserGroupGames();
      setGames(fetchedGames);
      setError(null);
    } catch (err) {
      setError("Failed to load games. Please try again later.");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGames();
  }, []);

  const handleCreateGame = () => {
    setShowCreateModal(true);
  };

  const handleGameCreated = () => {
    fetchGames();
  };

  const handleGameJoined = () => {
    fetchGames();
  };

  const handleGameLeft = () => {
    fetchGames();
  };

  return (
    <div className={styles.gamesSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Games</h2>

        <Button variant="primary" size="sm" onClick={handleCreateGame}>
          Create Game
        </Button>
      </div>

      {loading ? (
        <p className={styles.message}>Loading games...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : games.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No games found.</p>
        </div>
      ) : (
        <GamesList
          games={games}
          onGameJoined={handleGameJoined}
          onGameLeft={handleGameLeft}
          currentUserId={user?.id}
        />
      )}

      <CreateGameModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleGameCreated}
      />
    </div>
  );
};

export default GamesSection;
