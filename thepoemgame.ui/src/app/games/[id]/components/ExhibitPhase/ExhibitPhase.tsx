import React from 'react';
import { GameResponse } from '@/services/gameService';
import { PoemCard } from './PoemCard/PoemCard';
import styles from './ExhibitPhase.module.css';

interface ExhibitPhaseProps {
  game: GameResponse;
}

export function ExhibitPhase({ game }: ExhibitPhaseProps) {
  return (
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
              game={game}
            />
          ))}
        </div>
      ) : (
        <div className={styles.warningMessage}>
          <p>No completed poems available yet.</p>
        </div>
      )}
    </div>
  );
}