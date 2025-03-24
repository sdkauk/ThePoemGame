import React, { useState, useEffect, Children, cloneElement } from "react";
import styles from "./Carousel.module.css";

interface CarouselProps {
  children: React.ReactNode;
  initialPosition?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  initialPosition = 1,
  showArrows = true,
  showDots = true,
  className = "",
}) => {
  const childrenArray = Children.toArray(children);
  const totalItems = childrenArray.length;
  const [position, setPosition] = useState(
    Math.min(Math.max(initialPosition, 1), totalItems || 1)
  );

  if (totalItems < 1) {
    return <div className={styles.emptyCarousel}>No items to display</div>;
  }

  const handlePrevious = () => {
    setPosition((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPosition((prev) => (prev < totalItems ? prev + 1 : prev));
  };

  const handleDotClick = (index: number) => {
    setPosition(index + 1);
  };

  // Apply position-based styling to all items
  const positionedChildren = childrenArray.map((child, index) => {
    // Calculate relative position variables
    const offset = index + 1;
    const relativePos = position - offset;
    const absRelativePos = Math.abs(relativePos);

    // Simplified transforms for better centering and visibility
    const scale = 1 - 0.2 * Math.min(absRelativePos, 1);
    const translateX = -350 * relativePos; // Reduced distance to keep cards more centered
    const zIndex = 10 - absRelativePos;
    const opacity = 1 - 0.4 * Math.min(absRelativePos, 1); // Less opacity change
    const visible = absRelativePos <= 1.5; // Show slightly more cards

    return cloneElement(child as React.ReactElement, {
      key: index,
      className: `${styles.item} ${
        (child as React.ReactElement).props.className || ""
      }`,
      style: {
        transform: `translateX(${translateX}px) scale(${scale})`,
        zIndex,
        opacity,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
        ...(child as React.ReactElement).props.style,
      },
    });
  });

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.container}>{positionedChildren}</div>

      {showArrows && (
        <>
          <button
            onClick={handlePrevious}
            className={`${styles.arrow} ${styles.arrowLeft}`}
            aria-label="Previous item"
            disabled={position <= 1}
          >
            ←
          </button>

          <button
            onClick={handleNext}
            className={`${styles.arrow} ${styles.arrowRight}`}
            aria-label="Next item"
            disabled={position >= totalItems}
          >
            →
          </button>
        </>
      )}

      {showDots && (
        <div className={styles.nav}>
          {childrenArray.map((_, index) => (
            <button
              key={index}
              className={`${styles.navBtn} ${
                position === index + 1 ? styles.navBtnActive : ""
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Carousel;
