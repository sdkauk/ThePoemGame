'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { groupService, Group } from '@/services/groupService';
import { Game, gameService, GameStatus } from '@/services/gameService'
import { userService } from '@/services/userService';
import { AuthGuard } from '@/auth/AuthGuard';
import { useAuth } from '@/auth/use-auth';
import Link from 'next/link';
import CreateGameModal from '@/components/CreateGameModal';

export default function GroupDetailPage() {
  return (
    <AuthGuard>
      <GroupDetail />
    </AuthGuard>
  );
}

function GroupDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const groupId = params.id as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New state for games
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  
  // New state to track which games the user is in
  const [userGameMemberships, setUserGameMemberships] = useState<{[gameId: string]: boolean}>({});
  const [membershipLoading, setMembershipLoading] = useState(false);
  
  const { loading: leaveLoading, error: leaveError, execute: executeLeave } = useApi();

  // Fetch the group data
  const fetchGroup = async () => {
    if (!groupId || !isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await groupService.getGroup(groupId);
      setGroup(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load group');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch games for this group
  const fetchGames = async () => {
    if (!groupId || !isAuthenticated) return;
    
    try {
      setGamesLoading(true);
      const result = await gameService.getGroupGames(groupId);
      setGames(result);
    } catch (err) {
      setGamesError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setGamesLoading(false);
    }
  };
  
  const fetchUserMemberships = async () => {
    if (!games.length) return;
    
    try {
      setMembershipLoading(true);
      
      // Create an object to store membership status for each game
      const memberships: {[gameId: string]: boolean} = {};
      
      // Check each game individually using the endpoint
      const membershipPromises = games.map(async (game) => {
        try {
          const isInGame = await gameService.isUserInGame(game.id);
          memberships[game.id] = isInGame;
        } catch (error) {
          console.error(`Error checking membership for game ${game.id}:`, error);
          memberships[game.id] = false;
        }
      });
      
      // Wait for all membership checks to complete
      await Promise.all(membershipPromises);
      
      setUserGameMemberships(memberships);
console.log("User game memberships:", memberships);
      
    } catch (err) {
      console.error('Error fetching user game memberships:', err);
    } finally {
      setMembershipLoading(false);
    }
    
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGroup();
    }
  }, [groupId, isAuthenticated]);
  
  useEffect(() => {
    if (isAuthenticated && group) {
      fetchGames();
    }
  }, [groupId, isAuthenticated, group]);
  
  useEffect(() => {
    if (games.length > 0) {
      fetchUserMemberships();
    }
  }, [games]);

  const handleLeaveGroup = async () => {
    if (confirm('Are you sure you want to leave this group?')) {
      await executeLeave(
        () => userService.leaveGroup(groupId),
        (success) => {
          if (success) {
            router.push('/');
          }
        }
      );
    }
  };
  
  const handleGameCreated = (newGame: Game) => {
    setGames(prevGames => [...prevGames, newGame]);
    // Automatically add the creator to the game
    setUserGameMemberships(prev => ({...prev, [newGame.id]: true}));
  };

  const handleJoinGame = async (gameId: string) => {
    try {
      await userService.joinGameById(gameId);
      // Update local state immediately for better UX
      setUserGameMemberships(prev => ({...prev, [gameId]: true}));
      // Refresh all games for complete data
      fetchGames();
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };
  
  const handleLeaveGame = async (gameId: string) => {
    if (confirm('Are you sure you want to leave this game?')) {
      try {
        await userService.leaveGame(gameId);
        // Update local state immediately for better UX
        setUserGameMemberships(prev => ({...prev, [gameId]: false}));
        // Refresh all games for complete data
        fetchGames();
      } catch (error) {
        console.error('Failed to leave game:', error);
      }
    }
  };

  const getStatusDisplay = (status: GameStatus) => {
    switch (status) {
      case GameStatus.WaitingForPlayers:
        return 'Waiting for Players';
      case GameStatus.InProgress:
        return 'Game in Progress';
      case GameStatus.Completed:
        return 'Completed';
      case GameStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown Status';
    }
  };

  const handleStartGame = async (gameId: string) => {
    try {
      await gameService.startGame(gameId);
      // Navigate to the game page after successfully starting it
      router.push(`/games/${gameId}`);
    } catch (error) {
      console.error('Failed to start game:', error);
      // Optionally display an error message to the user
    }
  };

  if (loading) return <div className="container mx-auto p-4">Loading group details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  if (!group) return <div className="container mx-auto p-4">Group not found</div>;


  // Check if current user is a member
//   const isCurrentUserMember = group.members.some(member => member.id === user?.localAccountId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Groups
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        

          <div className="mt-4 md:mt-0">
            <button
              onClick={handleLeaveGroup}
              disabled={leaveLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {leaveLoading ? 'Leaving...' : 'Leave Group'}
            </button>
          </div>

          

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {/* Members Section */}
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <h2 className="text-xl font-semibold mb-4">Members ({group.members.length})</h2>
    {group.members.length > 0 ? (
      <ul className="divide-y">
        {group.members.map(member => (
          <li key={member.id} className="py-3 first:pt-0 last:pb-0">
            {member.name}
          </li>
        ))}
      </ul>
    ) : (
      <p>No members yet.</p>
    )}
  </div>

  {/* Invite Code Section */}
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <h2 className="text-xl font-semibold mb-2">Invite Code</h2>
    <p className="mb-4">Share this code with friends to invite them to your group:</p>
    <div className="flex items-center">
      <code className="p-3 bg-gray-200 dark:bg-gray-700 rounded-md flex-grow font-mono">
        {group.inviteCode}
      </code>
      <button
        onClick={() => {
          navigator.clipboard.writeText(group.inviteCode);
          alert('Invite code copied to clipboard!');
        }}
        className="ml-2 p-2 bg-foreground text-background rounded-md hover:opacity-90"
      >
        Copy
      </button>
    </div>
  </div>
</div>
      {leaveError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {leaveError}
        </div>
      )}

<div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Games</h2>
    <button
      onClick={() => setIsCreateGameModalOpen(true)}
      className="px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90"
    >
      Create Game
    </button>
  </div>
  
  {gamesLoading ? (
    <p>Loading games...</p>
  ) : gamesError ? (
    <p className="text-red-500">{gamesError}</p>
  ) : games.length > 0 ? (
    <div className="grid grid-cols-1 gap-4">
{games.map(game => {
  // This line is correctly retrieving the membership status for each specific game
  const isUserInGame = userGameMemberships[game.id] || false;
  
  return (
    <div key={game.id} className="border rounded-md p-4 bg-white dark:bg-gray-700">
      <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <span className="font-medium">Players:</span> {game.players.length}/{game.maxPlayers}
        </div>
        <div>
          <span className="font-medium">Lines Per Poem:</span> {game.linesPerPoem}
        </div>
      </div>
      
      {game.players.length > 0 && (
        <div className="mt-2">
          <h4 className="font-medium mb-1">Players:</h4>
          <div className="flex flex-wrap gap-1">
            {game.players.map(player => (
              <span key={player.id} className="inline-block bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-md text-sm">
                {player.name}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3">
  <Link href={`/games/${game.id}`} className="text-blue-500 hover:underline">
    View Game
  </Link>
  
  {/* Debug display */}
  <div className="text-xs text-gray-500">
    Status: {String(isUserInGame)} | ID: {game.id}
  </div>

  <div className="mt-2">
  <span className="font-medium">Status: </span>
  <span className={`
    ${game.status === GameStatus.WaitingForPlayers ? 'text-yellow-500' : 
      game.status === GameStatus.InProgress ? 'text-green-500' : 
      game.status === GameStatus.Completed ? 'text-blue-500' : 'text-red-500'}
  `}>
    {getStatusDisplay(game.status)}
  </span>
</div>

{isUserInGame && game.status === GameStatus.WaitingForPlayers && (
  <button
    onClick={() => handleStartGame(game.id)}
    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
  >
    Start Game
  </button>
)}

  {membershipLoading ? (
    <span className="text-sm italic">Checking membership...</span>
  ) : isUserInGame ? (
    <button
      onClick={() => handleLeaveGame(game.id)}
      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
    >
      Leave Game
    </button>
  ) : (
    <button
      onClick={() => handleJoinGame(game.id)}
      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
      disabled={game.players.length >= game.maxPlayers}
    >
      {game.players.length >= game.maxPlayers ? 'Game Full' : 'Join Game'}
    </button>
  )}
</div>
    </div>
  );
})}
    </div>
  ) : (
    <p>No games created yet.</p>
  )}
</div>

      <CreateGameModal
  isOpen={isCreateGameModalOpen}
  onClose={() => setIsCreateGameModalOpen(false)}
  onGameCreated={handleGameCreated}
  groupId={groupId}
/>
    </div>
    
  );
}


