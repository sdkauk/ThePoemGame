'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/auth/AuthGuard';
import { useApi } from '@/hooks/useApi';
import { GameResponse, gameService, GameStatus, GamePhase } from '@/services/gameService';
import Link from 'next/link';
import styles from './page.module.css';

// Import our components
import { CreatePoemsPhase } from './components/CreatePoemsPhase/CreatePoemsPhase';
import { RoundRobinPhase } from './components/RoundRobinPhase/RoundRobinPhase';
import { ExhibitPhase } from './components/ExhibitPhase/ExhibitPhase';

export default function GameDetailPage() {
  return (
    <AuthGuard>
      <GameDetail />
    </AuthGuard>
  );
}

function GameDetail() {
  const params = useParams();
  const gameId = params.id as string;
  
  const [game, setGame] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await gameService.getGame(gameId);
        setGame(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGame();
    }
  }, [gameId]);

  // Handler for when a poem is created or updated
  const handleGameUpdate = async () => {
    if (gameId) {
      try {
        const updatedGame = await gameService.getGame(gameId);
        setGame(updatedGame);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update game data');
      }
    }
  };

  if (loading) return <div className={styles.loadingContainer}>Loading game details...</div>;
  if (error) return <div className={styles.errorContainer}>Error: {error}</div>;
  if (!game) return <div className={styles.errorContainer}>Game not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link href={`/groups/${game.groupId}`} className={styles.backLink}>
          ← Back to Group
        </Link>
      </div>

      {/* Render phase-specific components based on game state */}
      {game.status === GameStatus.InProgress && game.phase === GamePhase.CreatePoems && (
        <CreatePoemsPhase game={game} onPoemCreated={handleGameUpdate} />
      )}
      
      {game.status === GameStatus.InProgress && game.phase === GamePhase.RoundRobin && (
        <RoundRobinPhase game={game} onPoemUpdated={handleGameUpdate} />
      )}

      {game.status === GameStatus.InProgress && game.phase === GamePhase.Exhibit && (
        <ExhibitPhase game={game} />
      )}
    </div>
  );
}