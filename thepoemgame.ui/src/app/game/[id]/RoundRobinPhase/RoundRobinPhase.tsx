import React, { useState } from "react";
import styles from "./RoundRobinPhase.module.css";
import { Game } from "@/services/gameService";
import {
  WaitingPoem,
  poemService,
  LineType,
  LinePostRequest,
} from "@/services/poemService";
import PoemCarousel from "../PoemCarousel/PoemCarousel";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import Card from "@/components/Card/card";

interface RoundRobinPhaseProps {
  game: Game;
  waitingPoems: WaitingPoem[];
  currentPoemIndex: number;
  onNextPoem: () => void;
  onPrevPoem: () => void;
}

const RoundRobinPhase: React.FC<RoundRobinPhaseProps> = ({
  game,
  waitingPoems,
  currentPoemIndex,
  onNextPoem,
  onPrevPoem,
}) => {
  const [newLine, setNewLine] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPoem = waitingPoems[currentPoemIndex] || null;

  const handleSubmitLine = async () => {
    if (!currentPoem) return;
    if (!newLine.trim()) {
      setError("Please enter some text for your line");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const lineRequest: LinePostRequest = {
        poemId: currentPoem.poemId,
        gameId: currentPoem.gameId,
        content: newLine,
        lineType: LineType.Response, // This will be adjusted by the backend based on previous line
      };

      await poemService.addLineToPoem(lineRequest);

      // Clear the input and go to next poem if available
      setNewLine("");
      if (waitingPoems.length > 1) {
        onNextPoem();
      }
    } catch (err) {
      console.error("Error submitting line:", err);
      setError("Failed to submit your line. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (waitingPoems.length === 0) {
    return (
      <div className={styles.noPoems}>
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            No poems waiting for your contribution
          </h2>
          <p>You've completed all your poems for this round!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.roundRobinPhase}>
      <h2 className={styles.gamePhaseTitle}>Round Robin Phase</h2>

      <div className={styles.poemSection}>
        <PoemCarousel
          currentPoem={currentPoem}
          onPrevPoem={onPrevPoem}
          onNextPoem={onNextPoem}
          poemCount={waitingPoems.length}
          currentIndex={currentPoemIndex}
        />

        <div className={styles.inputSection}>
          <div className={styles.instructions}>
            <p>Add the next line to "{currentPoem?.title}"</p>
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <Input
            value={newLine}
            onChange={(e) => setNewLine(e.target.value)}
            placeholder="Write your line here..."
            fullWidth
            disabled={submitting}
          />

          <div className={styles.actionButtons}>
            <Button
              variant="primary"
              onClick={handleSubmitLine}
              disabled={submitting || !newLine.trim()}
            >
              {submitting ? "Submitting..." : "Submit Line"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundRobinPhase;
