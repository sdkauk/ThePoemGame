import React, { FC, useState } from "react";
import styles from "./Carousel.module.css";
import { PaperProps } from "./PaperStyles";

interface CarouselProps {
  onSelectPaper?: (paperType: string) => void;
  items: { component: FC<PaperProps>; name: string }[];
  initialPosition?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  onSelectPaper,
  items,
  initialPosition = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(initialPosition, items.length - 1)
  );

  // Modify these functions to not trigger paper selection:
  const handlePrevious = () => {
    setActiveIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : prev;
      // Remove this line to prevent selection when using arrows
      // if (onSelectPaper) onSelectPaper(items[newIndex].name);
      return newIndex;
    });
  };

  const handleNext = () => {
    setActiveIndex((prev) => {
      const newIndex = prev < items.length - 1 ? prev + 1 : prev;
      // Remove this line to prevent selection when using arrows
      // if (onSelectPaper) onSelectPaper(items[newIndex].name);
      return newIndex;
    });
  };

  // Also modify the handleDotClick function:
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    // Remove this line to prevent selection when clicking dots
    // if (onSelectPaper) onSelectPaper(items[index].name);
  };

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    // Trigger the paper selection callback when an item is clicked directly
    if (onSelectPaper) onSelectPaper(items[index].name);
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselViewport}>
        {items.map((item, index) => {
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

          const PaperComponent = item.component;

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
              onClick={() => handleItemClick(index)}
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
        disabled={activeIndex >= items.length - 1}
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
        {items.map((_, index) => (
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
        {items[activeIndex].name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}{" "}
        Paper
      </div>
    </div>
  );
};

export default Carousel;
