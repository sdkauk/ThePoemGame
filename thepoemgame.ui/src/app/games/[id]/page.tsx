'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/auth/AuthGuard';
import { useApi } from '@/hooks/useApi';
import { Game, gameService, GameStatus } from '@/services/gameService';
import { Poem, poemService } from '@/services/poemService';
import Link from 'next/link';

// Main page component with AuthGuard
export default function GameDetailPage() {
  return (
    <AuthGuard>
      <GameDetail />
    </AuthGuard>
  );
}

// The actual game component
function GameDetail() {
  const params = useParams();
  const gameId = params.id as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for creating a poem
  const [poemTitle, setPoemTitle] = useState('');
  const [firstLine, setFirstLine] = useState('');
  const { loading: submitLoading, error: submitError, execute } = useApi();

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

  const handleSubmitPoem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!poemTitle.trim() || !firstLine.trim() || !gameId) return;
    
    await execute(
      async () => {
        // First create the poem
        const newPoem = await poemService.createPoem({
          title: poemTitle,
          firstLineContent: firstLine,
          gameId: gameId
        });
        
        // Refresh game data to update the UI
        const updatedGame = await gameService.getGame(gameId);
        setGame(updatedGame);
        
        // Clear form
        setPoemTitle('');
        setFirstLine('');
        
        return newPoem;
      }
    );
  };

  if (loading) return <div className="container mx-auto p-4">Loading game details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  if (!game) return <div className="container mx-auto p-4">Game not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href={`/groups/${game.groupId}`} className="text-blue-500 hover:underline">
          ← Back to Group
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
      
      <div className="mb-4">
        <span className="font-medium">Status: </span>
        <span className={`
          ${game.status === GameStatus.WaitingForPlayers ? 'text-yellow-500' : 
            game.status === GameStatus.InProgress ? 'text-green-500' : 
            game.status === GameStatus.Completed ? 'text-blue-500' : 'text-red-500'}
        `}>
          {game.status === GameStatus.WaitingForPlayers ? 'Waiting for Players' : 
           game.status === GameStatus.InProgress ? 'In Progress' : 
           game.status === GameStatus.Completed ? 'Completed' : 'Cancelled'}
        </span>
      </div>

      {/* Poem creation form - Only show during CreatePoems phase */}
      {game.status === GameStatus.InProgress && game.phase === 0 && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Your Poem</h2>
          
          <form onSubmit={handleSubmitPoem} className="space-y-4">
            <div>
              <label htmlFor="poemTitle" className="block mb-2 font-medium">
                Poem Title
              </label>
              <input
                type="text"
                id="poemTitle"
                value={poemTitle}
                onChange={(e) => setPoemTitle(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter a title for your poem"
                required
              />
            </div>
            
            <div>
              <label htmlFor="firstLine" className="block mb-2 font-medium">
                First Line
              </label>
              <textarea
                id="firstLine"
                value={firstLine}
                onChange={(e) => setFirstLine(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Write the first line of your poem"
                rows={3}
                required
              />
            </div>
            
            {submitError && <p className="text-red-500">{submitError}</p>}
            
            <button
              type="submit"
              disabled={submitLoading || !poemTitle.trim() || !firstLine.trim()}
              className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {submitLoading ? 'Creating...' : 'Create Poem'}
            </button>
          </form>
        </div>
      )}
      
      {/* Display player list */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Players ({game.players.length}/{game.maxPlayers})</h2>
        {game.players.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {game.players.map(player => (
              <div key={player.id} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                {player.name}
              </div>
            ))}
          </div>
        ) : (
          <p>No players have joined yet.</p>
        )}
      </div>
    </div>
  );
}