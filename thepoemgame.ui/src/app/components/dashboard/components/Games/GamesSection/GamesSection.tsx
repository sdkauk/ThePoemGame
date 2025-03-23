import React, { useEffect, useState } from "react";
import styles from "./GamesSection.module.css";
import Button from "@/components/Button/Button";
import { Game, gameService } from "@/services/gameService";
import GamesList from "../GamesList/GamesList";
import CreateGameModal from "../CreateGameModal/CreateGameModal";

interface GamesSectionProps {
  groupId?: string;
  user?: any;
}

const GamesSection: React.FC<GamesSectionProps> = ({ groupId, user }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchGames = async () => {
    try {
      setLoading(true);
      let fetchedGames: Game[];

      if (groupId) {
        fetchedGames = await gameService.getGroupGames(groupId);
      } else {
        fetchedGames = await gameService.getUserGames();
      }

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
  }, [groupId]);

  const handleCreateGame = () => {
    setShowCreateModal(true);
  };

  const handleGameCreated = () => {
    fetchGames();
  };

  const handleGameJoined = () => {
    fetchGames();
  };

  return (
    <div className={styles.gamesSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Games</h2>
        {groupId && (
          <Button variant="primary" size="sm" onClick={handleCreateGame}>
            Create Game
          </Button>
        )}
      </div>

      {loading ? (
        <p className={styles.message}>Loading games...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : games.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No games found.</p>
          {groupId && (
            <Button variant="primary" size="md" onClick={handleCreateGame}>
              Create a Game
            </Button>
          )}
        </div>
      ) : (
        <GamesList
          games={games}
          onGameJoined={handleGameJoined}
          currentUserId={user?.id}
        />
      )}

      {groupId && (
        <CreateGameModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGameCreated}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default GamesSection;
