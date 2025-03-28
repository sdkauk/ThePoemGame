import React, { useState } from "react";
import styles from "./CreatePoemsPhase.module.css";
import PaperCarousel from "./Components/PaperCarousel";
import {
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  BlackPaper,
  WatercolorPaper,
  PaperType,
} from "./Components/PaperStyles";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/input";
import FormItem from "@/components/Form/FormItem/FormItem";
import { poemService } from "@/services/poemService";
import { Game } from "@/services/gameService";
import PoemDisplay from "@/components/PoemDisplay/PoemDisplay";
import Card from "@/components/Card/card";

interface CreatePoemsPhaseProps {
  game: Game;
  onPoemCreated?: () => void;
}

// Add SUCCESS step to the type
type Step = "CHOOSE_PAPER" | "WRITE_TITLE" | "WRITE_FIRST_LINE" | "SUCCESS";

// Map string values from carousel to enum values
const paperTypeMap: Record<string, PaperType> = {
  "clean-white": PaperType.CleanWhite,
  "blue-lined": PaperType.BlueLinked,
  vintage: PaperType.Vintage,
  dark: PaperType.Dark,
  watercolor: PaperType.Watercolor,
};

const CreatePoemsPhase: React.FC<CreatePoemsPhaseProps> = ({
  game,
  onPoemCreated = () => {},
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("CHOOSE_PAPER");
  const [selectedPaper, setSelectedPaper] = useState<PaperType>(
    PaperType.BlueLinked
  );
  const [firstLine, setFirstLine] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaperSelect = (paperType: string) => {
    setSelectedPaper(paperTypeMap[paperType] || PaperType.BlueLinked);
    // Automatically advance to title step when paper is selected
    setCurrentStep("WRITE_TITLE");
  };

  const handleNextStep = () => {
    if (currentStep === "CHOOSE_PAPER" && selectedPaper !== undefined) {
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
      case PaperType.CleanWhite:
        return BlankWhitePaper;
      case PaperType.BlueLinked:
        return BlueLined;
      case PaperType.Vintage:
        return YellowishPaper;
      case PaperType.Dark:
        return BlackPaper;
      case PaperType.Watercolor:
        return WatercolorPaper;
      default:
        return BlueLined;
    }
  };

  const renderChoosePaperStep = () => {
    return (
      <div className={styles.carouselContainer}>
        <PaperCarousel onSelectPaper={handlePaperSelect} />
      </div>
    );
  };

  // Modified version with perfectly aligned inline button
  const renderWriteTitleStep = () => {
    const PaperComponent = getPaperComponent();

    return (
      <div className={styles.titleStepContainer}>
        <div className={styles.selectedPaperContainer}>
          <PoemDisplay
            poem={{
              id: "preview",
              title: title || "Your Title Here",
              lines: [],
              paperType: selectedPaper as any,
            }}
            className={styles.selectedPaper}
          />
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
                  size="md"
                />
              </div>
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={!title.trim()}
                className={styles.inlineButton}
                size="md"
              >
                Continue
              </Button>
            </div>
          </FormItem>
        </div>
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
        setIsSubmitting(true);
        const poemRequest = {
          gameId: game.id,
          title: title.trim(),
          firstLineContent: firstLine.trim(),
          paperType: selectedPaper,
        };

        // Call your API to create the poem
        await poemService.createPoem(poemRequest);

        // Call the callback provided by parent
        onPoemCreated();

        // Move to success step
        setCurrentStep("SUCCESS");
      } catch (err) {
        console.error("Error creating poem:", err);
        setError("Failed to create poem. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className={styles.titleStepContainer}>
        <div className={styles.selectedPaperContainer}>
          <PoemDisplay
            poem={{
              id: "preview",
              title: title || "Your Title Here",
              lines: [
                {
                  id: "first-line",
                  content: firstLine || "",
                  author: { id: "user", name: "You" },
                  lineNumber: 1,
                },
              ],
              paperType: selectedPaper as any,
            }}
            className={styles.selectedPaper}
          />
        </div>

        <div className={styles.titleInputContainer}>
          <FormItem htmlFor="firstLine" required error={error || undefined}>
            <div className={styles.inputWithButton}>
              <div className={styles.inputContainer}>
                <Input
                  id="firstLine"
                  value={firstLine}
                  onChange={(e) => {
                    setFirstLine(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Write the first line of your poem..."
                  fullWidth
                  size="md"
                />
              </div>
              <Button
                variant="primary"
                onClick={handleSubmitPoem}
                disabled={!firstLine.trim() || isSubmitting}
                className={styles.inlineButton}
                size="md"
              >
                {isSubmitting ? "Creating..." : "Create Poem"}
              </Button>
            </div>
          </FormItem>
        </div>
      </div>
    );
  };

  // New success step
  const renderSuccessStep = () => {
    return (
      <div className={styles.successContainer}>
        <Card className={styles.successCard}>
          <h2 className={styles.successTitle}>Poem Created Successfully!</h2>
          <p className={styles.successMessage}>
            Your poem has been created and shared with the other players. Once
            everyone has created their poems, the game will move to the next
            phase.
          </p>
          <p className={styles.successMessage}>
            In the next phase, you'll take turns adding lines to each other's
            poems.
          </p>

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              onClick={() => {
                // Reset form state for a new poem
                setTitle("");
                setFirstLine("");
                setSelectedPaper(PaperType.BlueLinked);
                setCurrentStep("CHOOSE_PAPER");
              }}
            >
              Create Another Poem
            </Button>
          </div>
        </Card>
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
      case "SUCCESS":
        return renderSuccessStep();
      default:
        return null;
    }
  };

  return <div className={styles.container}>{renderStep()}</div>;
};

export default CreatePoemsPhase;
