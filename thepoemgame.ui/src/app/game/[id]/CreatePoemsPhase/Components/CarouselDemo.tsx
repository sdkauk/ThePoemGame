import React, { useState, useEffect, Children, cloneElement } from "react";

interface PaperCarouselProps {
  children: React.ReactNode;
  initialPosition?: number;
}

const PaperCarousel: React.FC<PaperCarouselProps> = ({
  children,
  initialPosition = 3,
}) => {
  // Ensure we have at least 3 items for the carousel
  if (Children.count(children) < 3) {
    console.warn("PaperCarousel needs at least 3 children to work properly.");
  }
  const [position, setPosition] = useState(initialPosition);
  const childrenArray = Children.toArray(children);
  const totalItems = childrenArray.length;
  const middlePosition = Math.ceil(totalItems / 2);

  // Add CSS styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .carousel-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 85vh;
        position: relative;
        overflow: visible;
        --items: ${totalItems};
        --middle: ${middlePosition};
        --position: ${position};
      }
      
      .carousel-item {
        text-align: center;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        position: absolute;
        width: 595px; /* A4 paper width in pixels (approximately) */
        height: 842px; /* A4 paper height in pixels (approximately) */
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        --r: calc(var(--position) - var(--offset));
        --abs: max(calc(var(--r) * -1), var(--r));
        transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        transform: translateX(calc(-650px * var(--r))) 
                   scale(calc(1 - (0.4 * min(var(--abs), 1))));
        z-index: calc((var(--position) - var(--abs)));
        opacity: calc(1 - (0.7 * min(var(--abs), 1)));
        /* Hide cards that are more than 1 position away */
        visibility: calc(var(--abs) > 1 ? 'hidden' : 'visible');
        pointer-events: calc(var(--abs) > 1 ? 'none' : 'auto');
        /* Add paper-like styling */
        overflow: hidden;
      }
      
      .carousel-nav {
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: -50px;
        left: 0;
        right: 0;
      }
      
      .carousel-nav-btn {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #333;
        background-color: transparent;
        margin: 0 6px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      
      .carousel-nav-btn.active {
        background-color: #333;
      }
      
      .carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
        background-color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        font-size: 24px;
        opacity: 0.8;
        transition: opacity 0.3s, transform 0.3s;
      }
      
      .carousel-arrow:hover {
        opacity: 1;
        transform: translateY(-50%) scale(1.05);
      }
      
      .carousel-arrow-left {
        left: 10%;
      }
      
      .carousel-arrow-right {
        right: 10%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [totalItems, middlePosition, position]);

  const handlePrevious = () => {
    setPosition((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPosition((prev) => (prev < totalItems ? prev + 1 : prev));
  };

  const handleDotClick = (index: number) => {
    setPosition(index + 1);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="carousel-container">
        {childrenArray.map((child, index) =>
          cloneElement(child as React.ReactElement, {
            key: index,
            className: `carousel-item ${
              (child as React.ReactElement).props.className || ""
            }`,
            style: {
              "--offset": index + 1,
              ...(child as React.ReactElement).props.style,
            },
          })
        )}
      </div>

      <button
        onClick={handlePrevious}
        className="carousel-arrow carousel-arrow-left"
        aria-label="Previous item"
        disabled={position <= 1}
      >
        ←
      </button>

      <button
        onClick={handleNext}
        className="carousel-arrow carousel-arrow-right"
        aria-label="Next item"
        disabled={position >= totalItems}
      >
        →
      </button>

      <div className="carousel-nav">
        {childrenArray.map((_, index) => (
          <button
            key={index}
            className={`carousel-nav-btn ${
              position === index + 1 ? "active" : ""
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Paper style components
const BlankWhitePaper = (props) => (
  <div {...props} className={`${props.className} bg-white`}>
    <div className="h-full w-full"></div>
  </div>
);

const BlueLined = (props) => (
  <div {...props} className={`${props.className} bg-white`}>
    <div className="h-full w-full relative">
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-px bg-blue-300"
          style={{ top: `${(i + 1) * 24}px` }}
        ></div>
      ))}
    </div>
  </div>
);

const YellowishPaper = (props) => (
  <div {...props} className={`${props.className} bg-yellow-50`}>
    <div className="h-full w-full"></div>
  </div>
);

const GraphPaper = (props) => (
  <div {...props} className={`${props.className} bg-white`}>
    <div className="h-full w-full relative">
      {/* Horizontal lines */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute w-full h-px bg-blue-100"
          style={{ top: `${(i + 1) * 8}px` }}
        ></div>
      ))}
      {/* Vertical lines */}
      {Array.from({ length: 70 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute h-full w-px bg-blue-100"
          style={{ left: `${(i + 1) * 8}px` }}
        ></div>
      ))}
    </div>
  </div>
);

const DottedPaper = (props) => (
  <div {...props} className={`${props.className} bg-white`}>
    <div className="h-full w-full relative">
      {Array.from({ length: 100 }).map((_, row) =>
        Array.from({ length: 70 }).map((_, col) => (
          <div
            key={`dot-${row}-${col}`}
            className="absolute rounded-full w-1 h-1 bg-gray-300"
            style={{
              top: `${(row + 1) * 8}px`,
              left: `${(col + 1) * 8}px`,
            }}
          ></div>
        ))
      )}
    </div>
  </div>
);

// Demo component showing how to use the carousel with paper styles
const CarouselDemo = () => (
  <div className="bg-gray-100 p-8 min-h-screen flex flex-col items-center justify-center">
    <h2 className="text-gray-800 text-3xl font-bold mb-12">Paper Styles</h2>
    <PaperCarousel>
      <BlankWhitePaper />
      <BlueLined />
      <YellowishPaper />
      <GraphPaper />
      <DottedPaper />
    </PaperCarousel>
  </div>
);

export default CarouselDemo;
