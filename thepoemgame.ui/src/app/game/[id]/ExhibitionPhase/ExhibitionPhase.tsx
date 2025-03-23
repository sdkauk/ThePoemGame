import React, { useEffect, useState } from "react";
import styles from "./ExhibitionPhase.module.css";
import { Game } from "@/services/gameService";
import { Poem, poemService } from "@/services/poemService";
import Card from "@/components/Card/card";
import Button from "@/components/Button/Button";
import LinedPaper from "../LinedPaper/LinedPaper";
import PoemLine from "../PoemLine/PoemLine";

interface ExhibitionPhaseProps {
  game: Game;
}

const ExhibitionPhase: React.FC<ExhibitionPhaseProps> = ({ game }) => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoemId, setSelectedPoemId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPoems() {
      if (!game || !game.poems || game.poems.length === 0) return;

      try {
        setLoading(true);
        const poemPromises = game.poems.map((poem) =>
          poemService.getPoem(poem.id)
        );

        const fetchedPoems = await Promise.all(poemPromises);
        setPoems(fetchedPoems);

        // Select the first poem by default
        if (fetchedPoems.length > 0) {
          setSelectedPoemId(fetchedPoems[0].id);
        }
      } catch (err) {
        console.error("Error fetching poems:", err);
        setError("Failed to load poems. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchPoems();
  }, [game]);

  const selectedPoem = poems.find((poem) => poem.id === selectedPoemId);

  const renderPoemGallery = () => {
    return (
      <div className={styles.poemGallery}>
        {poems.map((poem) => (
          <Card
            key={poem.id}
            className={`${styles.poemCard} ${
              selectedPoemId === poem.id ? styles.selectedPoemCard : ""
            }`}
            // onClick={() => setSelectedPoemId(poem.id)}
          >
            <h3 className={styles.poemCardTitle}>{poem.title}</h3>
            <p className={styles.poemCardAuthor}>
              Started by {poem.Author.name}
            </p>
            <p className={styles.poemCardLines}>{poem.lines.length} lines</p>
          </Card>
        ))}
      </div>
    );
  };

  const renderSelectedPoem = () => {
    if (!selectedPoem) return null;

    return (
      <div className={styles.selectedPoemContainer}>
        <LinedPaper title={selectedPoem.title}>
          {selectedPoem.lines.map((line) => (
            <PoemLine
              key={line.id}
              content={line.content}
              author={line.author}
              lineNumber={line.lineNumber}
              isObscured={false}
            />
          ))}
        </LinedPaper>
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading poems...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (poems.length === 0) {
    return (
      <div className={styles.noPoems}>
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No poems available</h2>
          <p>There are no completed poems to display yet.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.exhibitionPhase}>
      <h2 className={styles.gamePhaseTitle}>Exhibition Phase</h2>

      <div className={styles.galleryDescription}>
        <p>
          All poems have been completed! Browse through the gallery to view
          everyone's collaborative creations.
        </p>
      </div>

      <div className={styles.exhibitionContent}>
        <div className={styles.galleryColumn}>
          <h3 className={styles.galleryTitle}>Poem Gallery</h3>
          {renderPoemGallery()}
        </div>

        <div className={styles.poemViewColumn}>{renderSelectedPoem()}</div>
      </div>
    </div>
  );
};

export default ExhibitionPhase;
