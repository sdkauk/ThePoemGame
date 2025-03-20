import React, { useState, useEffect } from 'react';
import { GameResponse } from '@/services/gameService';
import { LineType, Poem, poemService } from '@/services/poemService';
import Button from '@/components/Button/Button';
import styles from './RoundRobinPhase.module.css';
import { useApi } from '@/hooks/useApi';

interface RoundRobinPhaseProps {
  game: GameResponse;
  onPoemUpdated: () => void;
}

export function RoundRobinPhase({ game, onPoemUpdated }: RoundRobinPhaseProps) {
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [newLine, setNewLine] = useState('');
  const [currentFullPoem, setCurrentFullPoem] = useState<Poem | null>(null);
  const [loadingPoem, setLoadingPoem] = useState(false);
  const [poemError, setPoemError] = useState<string | null>(null);
  const { loading: lineSubmitLoading, error: lineSubmitError, execute: executeLineSubmit } = useApi();
  const [submittedPoemIds, setSubmittedPoemIds] = useState<Set<string>>(new Set());

  // Function to handle multiline text
  const handleMultilineText = (lineContent: string, lineHeight = 1.9) => {
    const approxCharsPerLine = 70;
    const contentLength = lineContent.length;
    const estimatedLines = Math.max(1, Math.ceil(contentLength / approxCharsPerLine));
    
    return estimatedLines > 1 ? { multiline: true, height: `${estimatedLines * lineHeight}rem` } : {};
  };

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

  // Handle adding a line to a poem
  const handleSubmitLine = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLine.trim() || !game.id) return;
    
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
          gameId: game.id,
          lineType: lineType
        });
        
        setSubmittedPoemIds(prev => new Set(prev).add(poemId));
        setNewLine('');
        
        if (currentPoemIndex < game.poemsWaiting.length - 1) {
          setCurrentPoemIndex(currentPoemIndex + 1);
        } else {
          onPoemUpdated();
          setCurrentPoemIndex(0);
        }
      }
    );
  };

  if (!game.poemsWaiting || game.poemsWaiting.length === 0) {
    return (
      <div className={styles.phaseSection}>
        <div className={styles.successMessage}>
          <p>
            You've contributed to all the poems currently waiting for you. Check back later to see if there are more poems that need your contribution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.phaseSection}>
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
    </div>
  );
}