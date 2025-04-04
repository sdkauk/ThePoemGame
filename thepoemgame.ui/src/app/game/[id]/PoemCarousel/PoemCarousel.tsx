import React, { useEffect, useState } from "react";
import styles from "./PoemCarousel.module.css";
import { WaitingPoem, poemService, Line, Poem } from "@/services/poemService";
import PoemDisplay from "@/components/PoemDisplay/PoemDisplay";

interface PoemCarouselProps {
  currentPoem: WaitingPoem | null;
  poemCount: number;
  currentIndex: number;
  onPrevPoem: () => void;
  onNextPoem: () => void;
}

const PoemCarousel: React.FC<PoemCarouselProps> = ({ currentPoem }) => {
  const [fullPoem, setFullPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentPoem) return;

    async function fetchPoemData() {
      try {
        setLoading(true);
        const poem = await poemService.getPoem(currentPoem!.poemId);
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
    return <PoemDisplay poem={fullPoem} paperType={"blue-lined"} />;
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.poemWrapper}>{renderPoemLines()}</div>
    </div>
  );
};

export default PoemCarousel;
