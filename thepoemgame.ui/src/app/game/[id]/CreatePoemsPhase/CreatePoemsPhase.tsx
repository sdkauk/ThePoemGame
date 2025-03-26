// In your CreatePoemsPhase.tsx
import React, { useState } from "react";
import styles from "./CreatePoemsPhase.module.css";
import PaperCarousel from "./Components/PaperCarousel";
import {
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  BlackPaper,
  WatercolorPaper,
} from "./Components/PaperStyles";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import FormItem from "@/components/Form/FormItem/FormItem";
import { poemService } from "@/services/poemService";
import { Game } from "@/services/gameService";

interface CreatePoemsPhaseProps {
  game: Game;
  onPoemCreated?: () => void;
}

type Step = "CHOOSE_PAPER" | "WRITE_TITLE" | "WRITE_FIRST_LINE";
type PaperType =
  | "clean-white"
  | "blue-lined"
  | "vintage"
  | "dark"
  | "watercolor";

const CreatePoemsPhase: React.FC<CreatePoemsPhaseProps> = ({
  game,
  onPoemCreated = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("CHOOSE_PAPER");
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);
  const [firstLine, setFirstLine] = useState(""); // Add this state if you don't already have it

  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePaperSelect = (paperType: string) => {
    setSelectedPaper(paperType as PaperType);
    // Automatically advance to title step when paper is selected
    setCurrentStep("WRITE_TITLE");
  };

  const handleNextStep = () => {
    if (currentStep === "CHOOSE_PAPER" && selectedPaper) {
      setCurrentStep("WRITE_TITLE");
    } else if (currentStep === "WRITE_TITLE") {
      if (!title.trim()) {
        setError("Please enter a title for your poem");
        return;
      }
      setCurrentStep("WRITE_FIRST_LINE");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "WRITE_TITLE") {
      setCurrentStep("CHOOSE_PAPER");
    } else if (currentStep === "WRITE_FIRST_LINE") {
      setCurrentStep("WRITE_TITLE");
    }
  };

  // Get the paper component based on selected type
  const getPaperComponent = () => {
    switch (selectedPaper) {
      case "clean-white":
        return BlankWhitePaper;
      case "blue-lined":
        return BlueLined;
      case "vintage":
        return YellowishPaper;
      case "dark":
        return BlackPaper;
      case "watercolor":
        return WatercolorPaper;
      default:
        return BlueLined;
    }
  };

  const renderChoosePaperStep = () => {
    return (
      <>
        {/* <h2 className={styles.stepTitle}>Step 1: Choose Your Paper Style</h2> */}
        <div className={styles.carouselContainer}>
          <PaperCarousel onSelectPaper={handlePaperSelect} />
        </div>
        {/* <div className={styles.paperInstructions}>
          Click on a paper style to select it
        </div> */}
      </>
    );
  };

  // Modified version with perfectly aligned inline button
  const renderWriteTitleStep = () => {
    const PaperComponent = getPaperComponent();

    return (
      <div className={styles.titleStepContainer}>
        {/* <h2 className={styles.stepTitle}>Step 2: Give Your Poem a Title</h2> */}

        <div className={styles.selectedPaperContainer}>
          <PaperComponent className={styles.selectedPaper}>
            <div className={styles.paperPreview}>
              <h3 className={styles.paperTitle}>
                {title ? title : "Your Title Here"}
              </h3>
            </div>
          </PaperComponent>
        </div>

        <div className={styles.titleInputContainer}>
          <FormItem htmlFor="poemTitle" required error={error || undefined}>
            <div className={styles.inputWithButton}>
              <div className={styles.inputContainer}>
                <Input
                  id="poemTitle"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter a title for your poem"
                  fullWidth
                  size="md" // Explicitly specify the size
                />
              </div>
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={!title.trim()}
                className={styles.inlineButton}
                size="md" // Ensure same size as input
              >
                Continue
              </Button>
            </div>
          </FormItem>
        </div>

        {/* <div className={styles.backButtonContainer}>
          <Button variant="outline" onClick={handlePreviousStep}>
            Back
          </Button>
        </div> */}
      </div>
    );
  };

  const renderWriteFirstLineStep = () => {
    const PaperComponent = getPaperComponent();

    const handleSubmitPoem = async () => {
      if (!firstLine.trim()) {
        return;
      }

      try {
        const poemRequest = {
          gameId: game.id, // Make sure you have this from props
          title: title.trim(),
          firstLineContent: firstLine.trim(),
          paperType: selectedPaper,
        };

        // Call your API to create the poem
        await poemService.createPoem(poemRequest);

        // Handle success - maybe show a success message or redirect
        // You might also want to call onPoemCreated() callback here if you have one

        // Reset form if needed
        setTitle("");
        setFirstLine("");
        setSelectedPaper(null);

        // Maybe redirect or show success view
      } catch (err) {
        console.error("Error creating poem:", err);
      }
    };

    return (
      <div className={styles.titleStepContainer}>
        <div className={styles.selectedPaperContainer}>
          <PaperComponent className={styles.selectedPaper}>
            <div className={styles.paperPreview}>
              <h3 className={styles.paperTitle}>{title}</h3>
              <p className={styles.paperFirstLine}>
                {firstLine ? firstLine : "Your first line will appear here..."}
              </p>
            </div>
          </PaperComponent>
        </div>

        <div className={styles.titleInputContainer}>
          <FormItem htmlFor="firstLine" required>
            <div className={styles.inputWithButton}>
              <div className={styles.inputContainer}>
                <Input
                  id="firstLine"
                  value={firstLine}
                  onChange={(e) => {
                    setFirstLine(e.target.value);
                  }}
                  placeholder="Write the first line of your poem..."
                  fullWidth
                  size="md"
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSubmitPoem}
                disabled={!firstLine.trim()}
                className={styles.inlineButton}
                size="md"
              >
                Create Poem
              </Button>
            </div>
          </FormItem>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case "CHOOSE_PAPER":
        return renderChoosePaperStep();
      case "WRITE_TITLE":
        return renderWriteTitleStep();
      case "WRITE_FIRST_LINE":
        return renderWriteFirstLineStep();
      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderStep()}</div>;
};

export default CreatePoemsPhase;
