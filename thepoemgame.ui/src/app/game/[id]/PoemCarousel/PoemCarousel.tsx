import React, { useEffect, useState } from "react";
import styles from "./PoemCarousel.module.css";
import { WaitingPoem, poemService, Line } from "@/services/poemService";
import LinedPaper from "../LinedPaper/LinedPaper";
import PoemLine from "../PoemLine/PoemLine";
import Button from "@/components/Button/Button";

interface PoemCarouselProps {
  currentPoem: WaitingPoem | null;
  poemCount: number;
  currentIndex: number;
  onPrevPoem: () => void;
  onNextPoem: () => void;
}

const PoemCarousel: React.FC<PoemCarouselProps> = ({
  currentPoem,
  poemCount,
  currentIndex,
  onPrevPoem,
  onNextPoem,
}) => {
  const [fullPoem, setFullPoem] = useState<{ lines: Line[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentPoem) return;

    async function fetchPoemData() {
      try {
        setLoading(true);
        const poem = await poemService.getPoem(currentPoem.poemId);
        setFullPoem(poem);
      } catch (error) {
        console.error("Error fetching poem:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoemData();
  }, [currentPoem]);

  if (!currentPoem) return null;

  // Show only the most recent line, obscure earlier lines
  const renderPoemLines = () => {
    if (!fullPoem || loading) {
      return <div className={styles.loading}>Loading poem content...</div>;
    }

    const lastLineIndex = fullPoem.lines.length - 1;

    return fullPoem.lines.map((line, index) => (
      <PoemLine
        key={line.id}
        content={line.content}
        author={line.author}
        lineNumber={line.lineNumber}
        isCurrentLine={index === lastLineIndex}
        isObscured={index < lastLineIndex}
      />
    ));
  };

  return (
    <div className={styles.carouselContainer}>
      {poemCount > 1 && (
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={onPrevPoem}
          aria-label="Previous poem"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      <div className={styles.poemWrapper}>
        <LinedPaper title={currentPoem.title} className={styles.poemPaper}>
          {renderPoemLines()}
        </LinedPaper>

        <div className={styles.poemCounter}>
          {currentIndex + 1} of {poemCount}
        </div>
      </div>

      {poemCount > 1 && (
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={onNextPoem}
          aria-label="Next poem"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};

export default PoemCarousel;
