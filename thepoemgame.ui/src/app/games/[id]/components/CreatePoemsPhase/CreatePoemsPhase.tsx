import React, { useState } from 'react';
import { GameResponse, GameStatus, GamePhase } from '@/services/gameService';
import { poemService } from '@/services/poemService';
import Button from '@/components/Button/Button';
import styles from './CreatePoemsPhase.module.css';
import { useApi } from '@/hooks/useApi';

interface CreatePoemsPhaseProps {
  game: GameResponse;
  onPoemCreated: () => void;
}

export function CreatePoemsPhase({ game, onPoemCreated }: CreatePoemsPhaseProps) {
  const [poemTitle, setPoemTitle] = useState('');
  const [firstLine, setFirstLine] = useState('');
  const { loading: submitLoading, error: submitError, execute } = useApi();

  const handleSubmitPoem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!poemTitle.trim() || !firstLine.trim() || !game.id) return;
    
    await execute(
      async () => {
        await poemService.createPoem({
          gameId: game.id,
          title: poemTitle,
          firstLineContent: firstLine
        });
        
        setPoemTitle('');
        setFirstLine('');
        onPoemCreated();
      }
    );
  };

  return (
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
  );
}