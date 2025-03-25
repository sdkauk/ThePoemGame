import React, { useState } from "react";
import styles from "./PaperCarousel.module.css";
import {
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  GraphPaper,
  DottedPaper,
  BlackPaper,
  WatercolorPaper,
} from "./PaperStyles";

interface PaperCarouselProps {
  onSelectPaper?: (paperType: string) => void;
  initialPosition?: number;
}

const PaperCarousel: React.FC<PaperCarouselProps> = ({
  onSelectPaper,
  initialPosition = 0,
}) => {
  const papers = [
    { component: BlankWhitePaper, name: "clean-white" },
    { component: BlueLined, name: "blue-lined" },
    { component: YellowishPaper, name: "vintage" },
    { component: GraphPaper, name: "graph" },
    { component: DottedPaper, name: "dotted" },
    { component: BlackPaper, name: "dark" },
    { component: WatercolorPaper, name: "watercolor" },
  ];

  const [activeIndex, setActiveIndex] = useState(
    Math.min(initialPosition, papers.length - 1)
  );

  const handlePrevious = () => {
    setActiveIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : prev;
      if (onSelectPaper) onSelectPaper(papers[newIndex].name);
      return newIndex;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      const newIndex = prev < papers.length - 1 ? prev + 1 : prev;
      if (onSelectPaper) onSelectPaper(papers[newIndex].name);
      return newIndex;
    });
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    if (onSelectPaper) onSelectPaper(papers[index].name);
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselViewport}>
        {papers.map((paper, index) => {
          // Calculate the position relative to the active item
          const offset = index - activeIndex;

          // Apply transforms based on the offset
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 1;

          // Calculate transforms
          let translateX = offset * 150; // % of container width
          let scale = isActive ? 1 : 0.8;
          let zIndex = isActive ? 10 : 5 - Math.abs(offset);
          let opacity = isActive ? 1 : 0.5;

          const PaperComponent = paper.component;

          return (
            <div
              key={index}
              className={`${styles.itemWrapper} ${
                isActive ? styles.activeItem : ""
              }`}
              style={{
                transform: `translateX(${translateX}%) scale(${scale})`,
                zIndex,
                opacity,
                visibility: isVisible ? "visible" : "hidden",
              }}
              onClick={() => handleDotClick(index)}
            >
              <PaperComponent className={styles.carouselItem} />
              {isActive && (
                <div className={styles.selectionIndicator}>
                  <span className={styles.selectedText}>Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handlePrevious}
        className={`${styles.navButton} ${styles.prevButton}`}
        disabled={activeIndex <= 0}
        aria-label="Previous paper style"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={handleNext}
        className={`${styles.navButton} ${styles.nextButton}`}
        disabled={activeIndex >= papers.length - 1}
        aria-label="Next paper style"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div className={styles.dotsContainer}>
        {papers.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              activeIndex === index ? styles.activeDot : ""
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Select paper style ${index + 1}`}
          />
        ))}
      </div>

      <div className={styles.paperName}>
        {papers[activeIndex].name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}{" "}
        Paper
      </div>
    </div>
  );
};

export default PaperCarousel;
