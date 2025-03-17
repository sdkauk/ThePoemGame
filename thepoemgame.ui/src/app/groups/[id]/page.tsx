'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { groupService, Group } from '@/services/groupService';
import { Game, gameService, GameStatus } from '@/services/gameService';
import { userService } from '@/services/userService';
import { AuthGuard } from '@/auth/AuthGuard';
import { useAuth } from '@/auth/use-auth';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import CreateGameModal from '@/components/CreateGameModal';
import styles from './page.module.css';

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
  
  // State for games
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  
  // State to track which games the user is in
  const [userGameMemberships, setUserGameMemberships] = useState<{[gameId: string]: boolean}>({});
  const [membershipLoading, setMembershipLoading] = useState(false);
  
  // For leaving the group
  const { loading: leaveLoading, error: leaveError, execute: executeLeave } = useApi();

  // Fetch group data
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
  
  // Check which games the user is part of
  const fetchUserMemberships = async () => {
    if (!games.length) return;
    
    try {
      setMembershipLoading(true);
      const memberships: {[gameId: string]: boolean} = {};
      
      const membershipPromises = games.map(async (game) => {
        try {
          const isInGame = await gameService.isUserInGame(game.id);
          memberships[game.id] = isInGame;
        } catch (error) {
          console.error(`Error checking membership for game ${game.id}:`, error);
          memberships[game.id] = false;
        }
      });
      
      await Promise.all(membershipPromises);
      setUserGameMemberships(memberships);
    } catch (err) {
      console.error('Error fetching user game memberships:', err);
    } finally {
      setMembershipLoading(false);
    }
  };

  // Initialize data
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

  // Handle user actions
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
    setUserGameMemberships(prev => ({...prev, [newGame.id]: true}));
  };

  const handleJoinGame = async (gameId: string) => {
    try {
      await userService.joinGameById(gameId);
      setUserGameMemberships(prev => ({...prev, [gameId]: true}));
      fetchGames();
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };
  
  const handleLeaveGame = async (gameId: string) => {
    if (confirm('Are you sure you want to leave this game?')) {
      try {
        await userService.leaveGame(gameId);
        setUserGameMemberships(prev => ({...prev, [gameId]: false}));
        fetchGames();
      } catch (error) {
        console.error('Failed to leave game:', error);
      }
    }
  };

  const handleStartGame = async (gameId: string) => {
    try {
      await gameService.startGame(gameId);
      router.push(`/games/${gameId}`);
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const getStatusDisplay = (status: GameStatus) => {
    switch (status) {
      case GameStatus.WaitingForPlayers: return 'Waiting for Players';
      case GameStatus.InProgress: return 'In Progress';
      case GameStatus.Completed: return 'Completed';
      case GameStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusClass = (status: GameStatus) => {
    switch (status) {
      case GameStatus.WaitingForPlayers: return styles.statusWaiting;
      case GameStatus.InProgress: return styles.statusInProgress;
      case GameStatus.Completed: return styles.statusCompleted;
      case GameStatus.Cancelled: return styles.statusCancelled;
      default: return '';
    }
  };

  if (loading) return <div className={styles.loadingContainer}>Loading group details...</div>;
  if (error) return <div className={styles.errorContainer}>Error: {error}</div>;
  if (!group) return <div className={styles.errorContainer}>Group not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link href="/" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>{group.name}</h1>
        <Button onClick={handleLeaveGroup} disabled={leaveLoading}>
          <span>{leaveLoading ? 'Leaving...' : 'Leave Group'}</span>
        </Button>
      </div>
      
      {leaveError && (
        <div className={styles.errorMessage}>
          {leaveError}
        </div>
      )}

      <div className={styles.twoColumns}>
        {/* Members Section */}
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Members</h2>
          {group.members.length > 0 ? (
            <ul className={styles.membersList}>
              {group.members.map(member => (
                <li key={member.id} className={styles.memberItem}>
                  {member.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>No members yet.</p>
          )}
        </div>

        {/* Invite Code Section */}
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Invite Friends</h2>
          <p className={styles.inviteText}>Share this code to invite friends:</p>
          <div className={styles.inviteCodeContainer}>
            <code className={styles.inviteCode}>
              {group.inviteCode}
            </code>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(group.inviteCode);
                alert('Invite code copied!');
              }}
            >
              <span>Copy</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Games Section */}
      <div className={styles.gamesSection}>
        <div className={styles.gamesSectionHeader}>
          <h2 className={styles.sectionTitle}>Games</h2>
          <Button onClick={() => setIsCreateGameModalOpen(true)}>
            <span>Create Game</span>
          </Button>
        </div>
        
        {gamesLoading ? (
          <p className={styles.loadingText}>Loading games...</p>
        ) : gamesError ? (
          <p className={styles.errorText}>{gamesError}</p>
        ) : games.length > 0 ? (
          <div className={styles.gamesGrid}>
            {games.map(game => {
              const isUserInGame = userGameMemberships[game.id] || false;
              
              return (
                <div key={game.id} className={styles.gameCard}>
                  <div className={styles.gameCardContent}>
                    <h3 className={styles.gameTitle}>{game.name}</h3>
                    
                    <div className={styles.gameInfoGrid}>
                      <div className={styles.gameInfo}>
                        <span className={styles.infoLabel}>Players:</span> 
                        <span className={styles.infoValue}>{game.players.length}/{game.maxPlayers}</span>
                      </div>
                      <div className={styles.gameInfo}>
                        <span className={styles.infoLabel}>Lines Per Poem:</span> 
                        <span className={styles.infoValue}>{game.linesPerPoem}</span>
                      </div>
                      <div className={styles.gameInfo}>
                        <span className={styles.infoLabel}>Status:</span> 
                        <span className={`${styles.statusBadge} ${getStatusClass(game.status)}`}>
                          {getStatusDisplay(game.status)}
                        </span>
                      </div>
                    </div>
                    
                    {game.players.length > 0 && (
                      <div className={styles.playersSection}>
                        <h4 className={styles.playersTitle}>Players:</h4>
                        <div className={styles.playersList}>
                          {game.players.map(player => (
                            <span key={player.id} className={styles.playerTag}>
                              {player.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.gameActions}>
                      <Link href={`/games/${game.id}`} className={styles.viewGameLink}>
                        View Game
                      </Link>
                      
                      {membershipLoading ? (
                        <span className={styles.membershipLoading}>Checking...</span>
                      ) : isUserInGame ? (
                        <div className={styles.actionButtons}>
                          {game.status === GameStatus.WaitingForPlayers && (
                            <Button onClick={() => handleStartGame(game.id)}>
                              <span>Start Game</span>
                            </Button>
                          )}
                          <Button onClick={() => handleLeaveGame(game.id)}>
                            <span>Leave Game</span>
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleJoinGame(game.id)}
                          disabled={game.players.length >= game.maxPlayers}
                        >
                          <span>{game.players.length >= game.maxPlayers ? 'Game Full' : 'Join Game'}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyGamesMessage}>
            <p>No games created yet.</p>
            <div className={styles.doodle}></div>
          </div>
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