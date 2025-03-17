'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/auth/AuthGuard';
import { useApi } from '@/hooks/useApi';
import { GameResponse, gameService, GameStatus, GamePhase } from '@/services/gameService';
import { LineType, Poem, poemService } from '@/services/poemService';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import styles from './page.module.css';

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
  
  // Form state for creating a poem
  const [poemTitle, setPoemTitle] = useState('');
  const [firstLine, setFirstLine] = useState('');
  const { loading: submitLoading, error: submitError, execute } = useApi();
  
  // Round robin state
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [newLine, setNewLine] = useState('');
  const [currentFullPoem, setCurrentFullPoem] = useState<Poem | null>(null);
  const [loadingPoem, setLoadingPoem] = useState(false);
  const [poemError, setPoemError] = useState<string | null>(null);
  const { loading: lineSubmitLoading, error: lineSubmitError, execute: executeLineSubmit } = useApi();
  const [submittedPoemIds, setSubmittedPoemIds] = useState<Set<string>>(new Set());

  // Function to handle multiline text
  const handleMultilineText = (lineContent, lineHeight = 1.9) => {
    const approxCharsPerLine = 70;
    const contentLength = lineContent.length;
    const estimatedLines = Math.max(1, Math.ceil(contentLength / approxCharsPerLine));
    
    return estimatedLines > 1 ? { multiline: true, height: `${estimatedLines * lineHeight}rem` } : {};
  };

  // Calculate max lines for a poem
  const calculateMaxLines = (poem, game) => {
    // Use the game's linesPerPoem setting as the definitive max
    const definedMaxLines = game.linesPerPoem;
    
    if (!poem?.lines?.length) {
      return definedMaxLines;
    }
    
    const actualLines = poem.lines.length;
    const isComplete = poem.isComplete || false;
    
    if (isComplete) {
      return actualLines;
    }
    
    // For in-progress poems, we still show all potential lines
    return definedMaxLines;
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

  // Helper functions
  const getCurrentWaitingPoemId = () => {
    if (!game?.poemsWaiting?.length) return null;
    return game.poemsWaiting[currentPoemIndex].id;
  };

  // Load current poem for round robin
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
      } finally {
        setLoadingPoem(false);
      }
    };
    
    loadCurrentPoem();
  }, [game, currentPoemIndex]);

  // Handle creating a new poem
  const handleSubmitPoem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!poemTitle.trim() || !firstLine.trim() || !gameId) return;
    
    await execute(
      async () => {
        const newPoem = await poemService.createPoem({
          gameId: gameId,
          title: poemTitle,
          firstLineContent: firstLine
        });
        
        const updatedGame = await gameService.getGame(gameId);
        setGame(updatedGame);
        
        setPoemTitle('');
        setFirstLine('');
        
        return newPoem;
      }
    );
  };

  // Handle adding a line to a poem
  const handleSubmitLine = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLine.trim() || !gameId) return;
    
    const poemId = getCurrentWaitingPoemId();
    if (!poemId || !currentFullPoem) return;
    
    const lineType = currentFullPoem.lines.length % 2 === 0 
      ? LineType.Call 
      : LineType.Response;
    
    await executeLineSubmit(
      async () => {
        await poemService.addLineToPoem({
          content: newLine,
          poemId: poemId,
          gameId: gameId,
          lineType: lineType
        });
        
        setSubmittedPoemIds(prev => new Set(prev).add(poemId));
        setNewLine('');
        
        if (currentPoemIndex < game.poemsWaiting.length - 1) {
          setCurrentPoemIndex(currentPoemIndex + 1);
        } else {
          const updatedGame = await gameService.getGame(gameId);
          setGame(updatedGame);
          setCurrentPoemIndex(0);
        }
      }
    );
  };

  // Poem display component for Exhibit phase
  const PoemCard = ({ poemId, title, author }) => {
    const [expanded, setExpanded] = useState(false);
    const [poem, setPoem] = useState<Poem | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [maxLines, setMaxLines] = useState(12); // Default max lines
    
    const fetchPoemDetails = async () => {
      if (!expanded || poem) return;
      
      try {
        setLoading(true);
        setError(null);
        const poemData = await poemService.getPoem(poemId);
        setPoem(poemData);
        
        // Calculate total lines needed
        setMaxLines(calculateMaxLines(poem, game));
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
      <div className={styles.poemCard}>
        <div 
          className={styles.poemCardHeader} 
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className={styles.poemCardTitle}>{title}</h3>
          <p className={styles.poemCardAuthor}>Created by {author.name}</p>
          
          <div className={styles.poemCardToggle}>
            <span>
              {expanded ? 'Hide poem' : 'View poem'}
            </span>
            <svg 
              className={`${styles.toggleIcon} ${expanded ? styles.expanded : ''}`} 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 9l-7 7-7-7" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {expanded && (
          <div className={styles.poemCardContent}>
            {loading ? (
              <div className={styles.loadingMessage}>Loading poem...</div>
            ) : error ? (
              <div className={styles.errorMessage}>{error}</div>
            ) : poem ? (
              <div className={styles.poemLines}>
                {/* Generate all lines up to maxLines */}
                {Array.from({ length: maxLines }).map((_, index) => {
                  const line = poem.lines[index];
                  
                  // If the line exists, render it with content and author
                  if (line) {
                    const multilineProps = handleMultilineText(line.content);
                    
                    return (
                      <div 
                        key={line.id} 
                        className={`${styles.poemLine} ${multilineProps.multiline ? styles.multiline : ''}`}
                        style={multilineProps.height ? { height: multilineProps.height } : {}}
                      >
                        <p className={styles.lineContent}>
                          <span className={styles.lineNumber}>{index + 1}.</span>
                          <span>{line.content}</span>
                        </p>
                        <p className={styles.lineAuthor}>
                          – {line.author.name}
                        </p>
                      </div>
                    );
                  }
                  
                  // If the line doesn't exist yet, render an empty placeholder line
                  return (
                    <div key={`empty-${index}`} className={`${styles.poemLine} ${styles.emptyLine}`}>
                      <p className={styles.lineContent}>
                        <span className={styles.lineNumber}>{index + 1}.</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyMessage}>No poem content available</div>
            )}
          </div>
        )}
      </div>
    );
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

      {/* Create Poems Phase UI */}
      {game.status === GameStatus.InProgress && game.phase === GamePhase.CreatePoems && (
        <div className={styles.phaseSection}>
          <h2 className={styles.sectionTitle}>Create Your Poem</h2>
          
          {game.hasCreatedPoem ? (
            <div className={styles.infoMessage}>
              <p>
                You have already created a poem for this game. Once all players have created their poems, 
                the round-robin phase will begin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitPoem} className={styles.poemForm}>
              <div className={styles.formGroup}>
                <label htmlFor="poemTitle" className={styles.formLabel}>
                  Poem Title
                </label>
                <input
                  type="text"
                  id="poemTitle"
                  value={poemTitle}
                  onChange={(e) => setPoemTitle(e.target.value)}
                  className={styles.formInput}
                  placeholder="Enter a title for your poem"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="firstLine" className={styles.formLabel}>
                  First Line
                </label>
                <textarea
                  id="firstLine"
                  value={firstLine}
                  onChange={(e) => setFirstLine(e.target.value)}
                  className={styles.formTextarea}
                  placeholder="Write the first line of your poem"
                  rows={3}
                  required
                />
              </div>
              
              {submitError && <p className={styles.errorText}>{submitError}</p>}
              
              <div className={styles.formActions}>
                <Button
                  type="submit"
                  disabled={submitLoading || !poemTitle.trim() || !firstLine.trim()}
                >
                  <span>{submitLoading ? 'Creating...' : 'Create Poem'}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Round Robin Phase UI */}
      {game.status === GameStatus.InProgress && game.phase === GamePhase.RoundRobin && (
        <div className={styles.phaseSection}>
          
          {game.poemsWaiting && game.poemsWaiting.length > 0 ? (
            <>
              <div className={styles.poemNavigation}>
                <span className={styles.poemCounter}>
                  Poem {currentPoemIndex + 1} of {game.poemsWaiting.length}
                </span>
              </div>
              
              {/* Display current poem */}
              {loadingPoem ? (
                <div className={styles.loadingMessage}>Loading poem...</div>
              ) : poemError ? (
                <div className={styles.errorMessage}>{poemError}</div>
              ) : currentFullPoem ? (
                <div className={styles.currentPoem}>
                  <h3 className={styles.currentPoemTitle}>{currentFullPoem.title}</h3>
                  
                  {/* Display existing lines and empty lines for future content */}
                  <div className={styles.poemLines}>
                    {/* Generate a maximum of 12 lines (or another appropriate maximum) */}
                    {Array.from({ length: 12 }).map((_, index) => {
                      const line = currentFullPoem.lines[index];
                      
                      // If the line exists, render it with content and author
                      if (line) {
                        const multilineProps = handleMultilineText(line.content);
                        
                        return (
                          <div 
                            key={line.id} 
                            className={`${styles.poemLine} ${multilineProps.multiline ? styles.multiline : ''}`}
                            style={multilineProps.height ? { height: multilineProps.height } : {}}
                          >
                            <p className={styles.lineContent}>
                              <span className={styles.lineNumber}>{index + 1}.</span>
                              <span>{line.content}</span>
                            </p>
                            <p className={styles.lineAuthor}>
                              – {line.author.name}
                            </p>
                          </div>
                        );
                      }
                      
                      // If it's the next line to add (the first missing line), make it obvious
                      if (index === currentFullPoem.lines.length) {
                        return (
                          <div key={`next-${index}`} className={`${styles.poemLine} ${styles.nextLine}`}>
                            <p className={styles.lineContent}>
                              <span className={styles.lineNumber}>{index + 1}.</span>
                              <span className={styles.linePrompt}>Your line here...</span>
                            </p>
                          </div>
                        );
                      }
                      
                      // Otherwise just show an empty line
                      return (
                        <div key={`empty-${index}`} className={`${styles.poemLine} ${styles.emptyLine}`}>
                          <p className={styles.lineContent}>
                            <span className={styles.lineNumber}>{index + 1}.</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Add line form */}
                  <form onSubmit={handleSubmitLine} className={styles.addLineForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="newLine" className={styles.formLabel}>
                        Add Your Line
                      </label>
                      <textarea
                        id="newLine"
                        value={newLine}
                        onChange={(e) => setNewLine(e.target.value)}
                        className={styles.formTextarea}
                        placeholder="Continue the poem..."
                        rows={2}
                        required
                      />
                    </div>
                    
                    {lineSubmitError && <p className={styles.errorText}>{lineSubmitError}</p>}
                    
                    <div className={styles.formActions}>
                      {currentPoemIndex > 0 && (
                        <Button
                          type="button"
                          onClick={() => setCurrentPoemIndex(currentPoemIndex - 1)}
                          disabled={Array.from(submittedPoemIds).some(id => 
                            game.poemsWaiting.slice(0, currentPoemIndex).some(poem => poem.id === id)
                          )}
                        >
                          <span>Previous Poem</span>
                        </Button>
                      )}
                      
                      <Button
                        type="submit"
                        disabled={lineSubmitLoading || !newLine.trim()}
                      >
                        <span>{lineSubmitLoading ? 'Submitting...' : 'Submit Line'}</span>
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className={styles.emptyMessage}>No poem selected</div>
              )}
            </>
          ) : (
            <div className={styles.successMessage}>
              <p>
                You've contributed to all the poems currently waiting for you. Check back later to see if there are more poems that need your contribution.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Exhibit Phase UI */}
      {game.status === GameStatus.InProgress && game.phase === GamePhase.Exhibit && (
        <div className={styles.phaseSection}>
          <h2 className={styles.sectionTitle}>Poem Exhibit</h2>
          <p className={styles.exhibitDescription}>All poems are complete! Enjoy reading everyone's collaborative creations.</p>
          
          {game.poems && game.poems.length > 0 ? (
            <div className={styles.poemsGrid}>
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
            <div className={styles.warningMessage}>
              <p>No completed poems available yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}