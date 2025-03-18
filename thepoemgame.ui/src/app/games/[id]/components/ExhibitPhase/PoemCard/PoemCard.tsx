import React, { useState, useEffect } from 'react';
import { GameResponse } from '@/services/gameService';
import { Poem, poemService } from '@/services/poemService';
import styles from './PoemCard.module.css';

interface PoemCardProps {
  poemId: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  game: GameResponse;
}

export function PoemCard({ poemId, title, author, game }: PoemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxLines, setMaxLines] = useState(12); // Default max lines
  
  // Function to handle multiline text
  const handleMultilineText = (lineContent: string, lineHeight = 1.9) => {
    const approxCharsPerLine = 70;
    const contentLength = lineContent.length;
    const estimatedLines = Math.max(1, Math.ceil(contentLength / approxCharsPerLine));
    
    return estimatedLines > 1 ? { multiline: true, height: `${estimatedLines * lineHeight}rem` } : {};
  };
  
  // Calculate max lines for a poem
  const calculateMaxLines = (poemData: Poem | null, gameData: GameResponse) => {
    // Use the game's linesPerPoem setting as the definitive max
    const definedMaxLines = gameData.linesPerPoem;
    
    if (!poemData?.lines?.length) {
      return definedMaxLines;
    }
    
    const actualLines = poemData.lines.length;
    const isComplete = poemData.isComplete || false;
    
    if (isComplete) {
      return actualLines;
    }
    
    // For in-progress poems, we still show all potential lines
    return definedMaxLines;
  };
  
  const fetchPoemDetails = async () => {
    if (!expanded || poem) return;
    
    try {
      setLoading(true);
      setError(null);
      const poemData = await poemService.getPoem(poemId);
      setPoem(poemData);
      
      // Calculate total lines needed
      setMaxLines(calculateMaxLines(poemData, game));
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
}