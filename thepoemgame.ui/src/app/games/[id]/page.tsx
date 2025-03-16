'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/auth/AuthGuard';
import { useApi } from '@/hooks/useApi';
import { GameResponse, gameService, GameStatus, GamePhase } from '@/services/gameService';
import { LineType, Poem, poemService } from '@/services/poemService';
import Link from 'next/link';

export default function GameDetailPage() {
  return (
    <AuthGuard>
      <GameDetail />
    </AuthGuard>
  );
}

function GameDetail() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  
  const [game, setGame] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for creating a poem
  const [poemTitle, setPoemTitle] = useState('');
  const [firstLine, setFirstLine] = useState('');
  const { loading: submitLoading, error: submitError, execute } = useApi();
  
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [newLine, setNewLine] = useState('');
  const [currentFullPoem, setCurrentFullPoem] = useState<Poem | null>(null);
  const [loadingPoem, setLoadingPoem] = useState(false);
  const [poemError, setPoemError] = useState<string | null>(null);
  const { loading: lineSubmitLoading, error: lineSubmitError, execute: executeLineSubmit } = useApi();
  const [submittedPoemIds, setSubmittedPoemIds] = useState<Set<string>>(new Set());
  
  // Helper function to get current poem ID to work on
  const getCurrentWaitingPoemId = () => {
    if (!game || !game.poemsWaiting || game.poemsWaiting.length === 0) {
      return null;
    }
    
    return game.poemsWaiting[currentPoemIndex].id;
  };

  

  // Helper function to get phase display text
  const getPhaseDisplay = (phase: GamePhase) => {
    switch (phase) {
      case GamePhase.CreatePoems:
        return 'Create Poems';
      case GamePhase.RoundRobin:
        return 'Round Robin';
      case GamePhase.Exhibit:
        return 'Exhibit';
      case GamePhase.Awards:
        return 'Awards';
      default:
        return 'Unknown Phase';
    }
  };
  
  // Helper function to get current poem to work on
  const getCurrentWaitingPoem = () => {
    if (!game || !game.poemsWaiting || game.poemsWaiting.length === 0) {
      return null;
    }
    
    return game.poemsWaiting[currentPoemIndex];
  };

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

  // Handle creating a new poem
  const handleSubmitPoem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!poemTitle.trim() || !firstLine.trim() || !gameId) return;
    
    await execute(
      async () => {
        // Create the poem with title and first line in one request
        const newPoem = await poemService.createPoem({
          gameId: gameId,
          title: poemTitle,
          firstLineContent: firstLine
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
  
// Add this effect to fetch the full poem when the current poem changes
useEffect(() => {
  const loadCurrentPoem = async () => {
    const poemId = getCurrentWaitingPoemId();
    if (!poemId) {
      setCurrentFullPoem(null);
      return;
    }
    
    try {
      setLoadingPoem(true);
      setPoemError(null);
      const poem = await poemService.getPoem(poemId);
      setCurrentFullPoem(poem);
    } catch (err) {
      setPoemError(err instanceof Error ? err.message : 'Failed to load poem');
      console.error('Error loading poem:', err);
    } finally {
      setLoadingPoem(false);
    }
  };
  
  loadCurrentPoem();
}, [game, currentPoemIndex]);

const handleSubmitLine = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newLine.trim() || !gameId) return;
  
  const poemId = getCurrentWaitingPoemId();
  if (!poemId || !currentFullPoem) return;
  
  // Determine the line type based on the number of existing lines
  const lineType = currentFullPoem.lines.length % 2 === 0 
    ? LineType.Call 
    : LineType.Response;
  
  await executeLineSubmit(
    async () => {
      // Submit the line with the determined lineType
      await poemService.addLineToPoem({
        content: newLine,
        poemId: poemId,
        gameId: gameId,
        lineType: lineType
      });
      
      // Add the current poem ID to the submitted set
      setSubmittedPoemIds(prev => new Set(prev).add(poemId));
      
      // Clear form
      setNewLine('');
      
      // Move to next poem or refresh game data
      if (currentPoemIndex < game.poemsWaiting.length - 1) {
        setCurrentPoemIndex(currentPoemIndex + 1);
      } else {
        // Refresh game data to update the UI
        const updatedGame = await gameService.getGame(gameId);
        setGame(updatedGame);
        setCurrentPoemIndex(0);
      }
    }
  );
};

// Create a PoemCard component for the Exhibit phase
const PoemCard = ({ poemId, title, author }) => {
  const [expanded, setExpanded] = useState(false);
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPoemDetails = async () => {
    if (!expanded || poem) return;
    
    try {
      setLoading(true);
      setError(null);
      const poemData = await poemService.getPoem(poemId);
      setPoem(poemData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load poem');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPoemDetails();
  }, [expanded, poemId]);
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="p-4 cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm text-gray-500">Created by {author.name}</p>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-blue-600 hover:underline">
            {expanded ? 'Hide poem' : 'View poem'}
          </span>
          <svg 
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t">
          {loading ? (
            <div className="py-4 text-center">Loading poem...</div>
          ) : error ? (
            <div className="py-4 text-center text-red-500">{error}</div>
          ) : poem ? (
            <div className="border-l-4 border-gray-300 pl-4 py-2">
              {poem.lines.map((line, index) => (
                <div key={line.id} className="mb-3">
                  <p>
                    <span className="text-gray-500 text-sm mr-2">{index + 1}.</span>
                    {line.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    – {line.author.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">No poem content available</div>
          )}
        </div>
      )}
    </div>
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
      
      {/* Status and Phase Display */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
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
        
        {game.status === GameStatus.InProgress && (
          <div>
            <span className="font-medium">Phase: </span>
            <span className="text-purple-600 font-medium">
              {getPhaseDisplay(game.phase)}
            </span>
          </div>
        )}
      </div>

      {/* Phase explanation box */}
      {game.status === GameStatus.InProgress && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold mb-2">
            {game.phase === GamePhase.CreatePoems ? 'Create Poems Phase' :
             game.phase === GamePhase.RoundRobin ? 'Round Robin Phase' :
             game.phase === GamePhase.Exhibit ? 'Exhibit Phase' : 'Awards Phase'}
          </h3>
          <p>
            {game.phase === GamePhase.CreatePoems ? 
              'Each player creates a poem with a title and first line. Once all players have created a poem, we move to the Round Robin phase.' :
             game.phase === GamePhase.RoundRobin ? 
              'Take turns adding lines to each other\'s poems. You\'ll receive poems to contribute to in sequence.' :
             game.phase === GamePhase.Exhibit ? 
              'All poems are complete! Enjoy reading everyone\'s collaborative creations.' :
              'Vote for your favorite poems in different categories.'}
          </p>
        </div>
      )}

      {/* Poem creation section - Only show during CreatePoems phase */}
      {game.status === GameStatus.InProgress && game.phase === GamePhase.CreatePoems && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Your Poem</h2>
          
          {game.hasCreatedPoem ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700">
                You have already created a poem for this game. Once all players have created their poems, 
                the round-robin phase will begin.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      )}
      
      {/* Round Robin Phase UI */}
{game.status === GameStatus.InProgress && game.phase === GamePhase.RoundRobin && (
  <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4">Round Robin: Add Lines to Poems</h2>
    
    {game.poemsWaiting && game.poemsWaiting.length > 0 ? (
      <>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Poem {currentPoemIndex + 1} of {game.poemsWaiting.length}
            </span>
          </div>
          
          {/* Display current poem */}
          {loadingPoem ? (
            <div className="text-center p-4">Loading poem...</div>
          ) : poemError ? (
            <div className="text-red-500 p-4">Error loading poem: {poemError}</div>
          ) : currentFullPoem ? (
            <div className="border rounded-md p-4 bg-white dark:bg-gray-700 mb-4">
              <h3 className="font-medium text-lg mb-2">{currentFullPoem.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Created by {currentFullPoem.author.name}
              </p>
              
              {/* Display existing lines */}
              {currentFullPoem.lines && currentFullPoem.lines.length > 0 && (
                <div className="border-l-4 border-gray-300 pl-4 py-2 mb-4">
                  {currentFullPoem.lines.map((line, index) => (
                    <div key={line.id} className="mb-2">
                      <p>
                        <span className="text-gray-500 text-sm mr-2">{index + 1}.</span>
                        {line.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        – {line.author.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add line form */}
              <form onSubmit={handleSubmitLine} className="space-y-4">
                <div>
                  <label htmlFor="newLine" className="block mb-2 font-medium">
                    Add Your Line
                  </label>
                  <textarea
                    id="newLine"
                    value={newLine}
                    onChange={(e) => setNewLine(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Continue the poem..."
                    rows={2}
                    required
                  />
                </div>
                
                {lineSubmitError && <p className="text-red-500">{lineSubmitError}</p>}
                
                {/* Round Robin Phase UI button section */}
<div className="flex justify-between">
  {currentPoemIndex > 0 && (
    <button
      type="button"
      onClick={() => setCurrentPoemIndex(currentPoemIndex - 1)}
      disabled={Array.from(submittedPoemIds).some(id => 
        game.poemsWaiting.slice(0, currentPoemIndex).some(poem => poem.id === id)
      )}
      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 
                disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous Poem
    </button>
  )}
  
  <button
    type="submit"
    disabled={lineSubmitLoading || !newLine.trim()}
    className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 disabled:opacity-50"
  >
    {lineSubmitLoading ? 'Submitting...' : 'Submit Line'}
  </button>
</div>
              </form>
            </div>
          ) : (
            <div className="text-center p-4">No poem selected</div>
          )}
        </div>
      </>
    ) : (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <p className="text-green-700">
          You've contributed to all the poems currently waiting for you. Check back later to see if there are more poems that need your contribution.
        </p>
      </div>
    )}
  </div>
)}

{/* Exhibit Phase UI */}
{game.status === GameStatus.InProgress && game.phase === GamePhase.Exhibit && (
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">Poem Exhibit</h2>
    <p className="mb-6">All poems are complete! Enjoy reading everyone's collaborative creations.</p>
    

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {game.poems.map((poemSummary) => (
          <PoemCard 
            key={poemSummary.id} 
            poemId={poemSummary.id} 
            title={poemSummary.title}
            author={poemSummary.author}
          />
        ))}
      </div>
    ) : (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">No completed poems available yet.</p>
      </div>
    )
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