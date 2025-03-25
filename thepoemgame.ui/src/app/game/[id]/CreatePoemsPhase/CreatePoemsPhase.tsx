// In your CreatePoemsPhase.tsx
import React, { useState } from "react";
import styles from "./CreatePoemsPhase.module.css";
import PaperCarousel from "./Components/PaperCarousel";
import {
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  GraphPaper,
  DottedPaper,
} from "./Components/PaperStyles";

interface CreatePoemsPhaseProps {}

type Step = "CHOOSE_PAPER" | "WRITE_TITLE" | "WRITE_FIRST_LINE";

const CreatePoemsPhase: React.FC<CreatePoemsPhaseProps> = ({}) => {
  const [currentStep, setCurrentStep] = useState<Step>("CHOOSE_PAPER");

  const renderStep = () => {
    switch (currentStep) {
      case "CHOOSE_PAPER":
        return (
          <div className={styles.container}>
            <div className={styles.carouselContainer}>
              <PaperCarousel />
            </div>
          </div>
        );
      case "WRITE_TITLE":
        return <></>;
      case "WRITE_FIRST_LINE":
        return <></>;
    }
  };

  return <div className={styles.container}>{renderStep()}</div>;
};

export default CreatePoemsPhase;
