import React, { useState } from "react";
import styles from "./CreatePoemsPhase.module.css";
import { Game } from "@/services/gameService";
import { poemService, PoemPostRequest } from "@/services/poemService";
import Card from "@/components/Card/card";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import LinedPaper from "../LinedPaper/LinedPaper";
import Label from "@/components/Label/label";
import FormItem from "@/components/Form/FormItem/FormItem";

interface CreatePoemsPhaseProps {
  game: Game;
  onPoemCreated: () => void;
}

const CreatePoemsPhase: React.FC<CreatePoemsPhaseProps> = ({
  game,
  onPoemCreated,
}) => {
  const [title, setTitle] = useState("");
  const [firstLine, setFirstLine] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user has already created a poem
  //   const hasCreatedPoem = game.hasCreatedPoem;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title for your poem");
      return;
    }

    if (!firstLine.trim()) {
      setError("Please enter the first line of your poem");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const poemRequest: PoemPostRequest = {
        gameId: game.id,
        title: title.trim(),
        firstLineContent: firstLine.trim(),
      };

      await poemService.createPoem(poemRequest);
      setSuccess(true);

      // Reset form
      setTitle("");
      setFirstLine("");

      // Notify parent component that poem was created
      onPoemCreated();
    } catch (err) {
      console.error("Error creating poem:", err);
      setError("Failed to create poem. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.createPoemsPhase}>
        <h2 className={styles.gamePhaseTitle}>Creation Phase</h2>
        <Card className={styles.poemCreatedCard}>
          <h3 className={styles.cardTitle}>Poem Created!</h3>
          <p>You've successfully created your poem for this game.</p>
          <p>
            Once all players have created their poems, the game will advance to
            the Round Robin phase.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.createPoemsPhase}>
      <h2 className={styles.gamePhaseTitle}>Creation Phase</h2>

      <div className={styles.instructions}>
        <p>Start by creating a poem with a title and first line.</p>
        <p>Each player creates one poem to begin the game.</p>
      </div>

      <div className={styles.createPoemContainer}>
        <form onSubmit={handleSubmit} className={styles.poemForm}>
          <FormItem
            label="Poem Title"
            htmlFor="poemTitle"
            required
            error={error || undefined}
          >
            <Input
              id="poemTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your poem"
              fullWidth
              disabled={isSubmitting}
            />
          </FormItem>

          <div className={styles.paperPreview}>
            <LinedPaper title={title || "Your Poem Title"}>
              <div className={styles.lineInputContainer}>
                <Label htmlFor="firstLine" required>
                  First Line
                </Label>
                <textarea
                  id="firstLine"
                  className={styles.lineTextarea}
                  value={firstLine}
                  onChange={(e) => setFirstLine(e.target.value)}
                  placeholder="Write the first line of your poem..."
                  disabled={isSubmitting}
                />
              </div>
            </LinedPaper>
          </div>

          <div className={styles.formActions}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !title.trim() || !firstLine.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Poem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoemsPhase;
