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

interface CreatePoemsPhaseOldProps {
  game: Game;
  onPoemCreated: () => void;
}

// Define the step types
type Step = "CHOOSE_PAPER" | "WRITE_TITLE" | "WRITE_FIRST_LINE";

const CreatePoemsPhase: React.FC<CreatePoemsPhaseOldProps> = ({
  game,
  onPoemCreated,
}) => {
  // Track which step we're currently on
  const [currentStep, setCurrentStep] = useState<Step>("CHOOSE_PAPER");

  // Store data from each step
  const [selectedPaper, setSelectedPaper] = useState<string>("lined");
  const [title, setTitle] = useState("");
  const [firstLine, setFirstLine] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Function to move to the next step
  const goToNextStep = () => {
    if (currentStep === "CHOOSE_PAPER") {
      setCurrentStep("WRITE_TITLE");
    } else if (currentStep === "WRITE_TITLE") {
      setCurrentStep("WRITE_FIRST_LINE");
    }
  };

  // Function to go back to previous step
  const goToPreviousStep = () => {
    if (currentStep === "WRITE_FIRST_LINE") {
      setCurrentStep("WRITE_TITLE");
    } else if (currentStep === "WRITE_TITLE") {
      setCurrentStep("CHOOSE_PAPER");
    }
  };

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
        paperType: selectedPaper, // Include the selected paper type
      };

      await poemService.createPoem(poemRequest);
      setSuccess(true);

      // Reset form
      setTitle("");
      setFirstLine("");
      setSelectedPaper("lined");

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
        <Card className={styles.poemCreatedCard}>
          <h3 className={styles.cardTitle}>Poem Created!</h3>
          <p>You've successfully created your poem for this game.</p>
        </Card>
      </div>
    );
  }

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case "CHOOSE_PAPER":
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Step 1: Choose Your Paper</h3>
            <div className={styles.paperOptions}>
              {/* Paper selection options would go here */}
              <div
                className={`${styles.paperOption} ${
                  selectedPaper === "lined" ? styles.selected : ""
                }`}
                onClick={() => setSelectedPaper("lined")}
              >
                <div className={styles.paperPreview}>
                  <LinedPaper title="">
                    <span className={styles.previewText}>Lined Paper</span>
                  </LinedPaper>
                </div>
              </div>

              {/* Add more paper options as needed */}
            </div>
            <div className={styles.stepActions}>
              <Button
                variant="primary"
                onClick={goToNextStep}
                disabled={!selectedPaper}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "WRITE_TITLE":
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Step 2: Write Your Title</h3>
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
              />
            </FormItem>
            <div className={styles.paperPreview}>
              <LinedPaper title={title || "Your Poem Title"}>
                <span className={styles.previewText}>Preview</span>
              </LinedPaper>
            </div>
            <div className={styles.stepActions}>
              <Button variant="secondary" onClick={goToPreviousStep}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={goToNextStep}
                disabled={!title.trim()}
              >
                Next
              </Button>
            </div>
          </div>
        );

      case "WRITE_FIRST_LINE":
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Step 3: Write Your First Line</h3>
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
                  />
                </div>
              </LinedPaper>
            </div>
            <div className={styles.stepActions}>
              <Button variant="secondary" onClick={goToPreviousStep}>
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !firstLine.trim()}
              >
                {isSubmitting ? "Creating..." : "Create Poem"}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.createPoemsPhase}>
      <div className={styles.stepsIndicator}>
        <div
          className={`${styles.step} ${
            currentStep === "CHOOSE_PAPER" ? styles.active : ""
          } ${currentStep !== "CHOOSE_PAPER" ? styles.completed : ""}`}
        >
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepLabel}>Choose Paper</div>
        </div>
        <div
          className={`${styles.step} ${
            currentStep === "WRITE_TITLE" ? styles.active : ""
          } ${currentStep === "WRITE_FIRST_LINE" ? styles.completed : ""}`}
        >
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepLabel}>Write Title</div>
        </div>
        <div
          className={`${styles.step} ${
            currentStep === "WRITE_FIRST_LINE" ? styles.active : ""
          }`}
        >
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepLabel}>Write First Line</div>
        </div>
      </div>

      <div className={styles.createPoemContainer}>{renderStep()}</div>
    </div>
  );
};

export default CreatePoemsPhase;
