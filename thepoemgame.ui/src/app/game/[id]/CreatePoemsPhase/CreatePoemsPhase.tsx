import React, { useState } from "react";
import styles from "./CreatePoemsPhase.module.css";
import Carousel from "./Components/Carousel";
import {
  Paper1,
  Paper2,
  Paper3,
  Paper4,
  Paper5,
} from "./Components/PaperStyles";
import CarouselDemo from "./Components/CarouselDemo";

interface CreatePoemsPhaseProps {}

type Step = "CHOOSE_PAPER" | "WRITE_TITLE" | "WRITE_FIRST_LINE";

const CreatePoemsPhase: React.FC<CreatePoemsPhaseProps> = ({}) => {
  const [currentStep, setCurrentStep] = useState<Step>("CHOOSE_PAPER");

  const renderStep = () => {
    switch (currentStep) {
      case "CHOOSE_PAPER":
        return (
          <div className={styles.carouselContainer}>
            <h1 className={styles.heading}>Choose Your Paper</h1>
            <CarouselDemo />
            {/* <Carousel initialPosition={1}>
              <Paper1>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Paper Style 1</h3>
                  <p>Simple white card for your content.</p>
                </div>
              </Paper1>

              <Paper2>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Paper Style 2</h3>
                  <p>Another card option for your poem.</p>
                </div>
              </Paper2>

              <Paper3>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Paper Style 3</h3>
                  <p>A third style for your creative writing.</p>
                </div>
              </Paper3>

              <Paper4>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Paper Style 4</h3>
                  <p>Yet another card design to choose from.</p>
                </div>
              </Paper4>

              <Paper5>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Paper Style 5</h3>
                  <p>The fifth card style for your poem.</p>
                </div>
              </Paper5>
            </Carousel> */}
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
