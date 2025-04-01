import React, { useEffect, useState, useRef } from "react";
import Paper, {
  PaperTitleSection,
  PaperTitle,
  PaperLineWrapper,
} from "../Paper/Paper";
import styles from "./PoemDisplay.module.css";

// Define interfaces for poem data
export interface Author {
  id: string;
  name: string;
}

export interface PoemLine {
  id: string;
  content: string;
  author: Author;
  lineNumber: number;
}

export interface Poem {
  id: string;
  title: string;
  lines: PoemLine[];
  paperType?: "blue-lined" | "blank-white" | "vintage" | "dark" | "watercolor";
}

interface PoemDisplayProps {
  poem?: Poem | null;
  totalLines?: number; // Total number of lines to display (including blanks)
  paperType?: "blue-lined" | "blank-white" | "vintage" | "dark" | "watercolor";
  className?: string;
  onLineClick?: (lineNumber: number) => void; // Optional callback for when a line is clicked
  draftLine?: string;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({
  poem,
  totalLines = 24,
  paperType,
  className = "",
  onLineClick,
  draftLine = "",
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const paperRef = useRef<HTMLDivElement>(null);

  // Measure container width for text wrapping
  useEffect(() => {
    if (!paperRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentWidth = entry.contentRect.width;
        setContainerWidth(contentWidth);
      }
    });

    resizeObserver.observe(paperRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Get the actual number of filled lines
  const existingLineCount = poem?.lines?.length || 0;

  // Calculate how many blank lines are needed
  const blankLineCount = Math.max(0, totalLines - existingLineCount);

  // Use paper type from poem data if provided, otherwise use prop or default
  const activePaperType = poem?.paperType || paperType || "blue-lined";

  // Handle click on a blank line
  const handleBlankLineClick = (lineNumber: number) => {
    if (onLineClick) {
      onLineClick(lineNumber);
    }
  };

  return (
    <div ref={paperRef} className={className}>
      <Paper paperType={activePaperType} showLineNumbers={true}>
        <PaperTitleSection>
          <PaperTitle>{poem?.title || "Untitled Poem"}</PaperTitle>
        </PaperTitleSection>

        {/* Render existing poem lines with proper wrapping */}
        {poem?.lines?.map((line) => (
          <PaperLineWrapper
            key={`poem-line-${line.id}`}
            content={line.content}
            lineNumber={line.lineNumber}
            author={line.author}
            containerWidth={containerWidth}
          />
        ))}

        {draftLine && (
          <PaperLineWrapper
            key="draft-line"
            content={draftLine}
            lineNumber={(poem?.lines?.length || 0) + 1}
            author={{ id: "id", name: "You" }}
            containerWidth={containerWidth}
          />
        )}

        {/* Render blank lines to fill up to totalLines */}
        {Array.from({ length: blankLineCount }).map((_, index) => {
          const lineNumber = existingLineCount + index + 1;
          return (
            <div
              key={`blank-line-${index}`}
              className={styles.blankLine}
              onClick={() => handleBlankLineClick(lineNumber)}
            >
              {/* <span className={styles.lineNumber}>{lineNumber}</span> */}
              <div className={styles.lineContent}></div>
            </div>
          );
        })}
      </Paper>
    </div>
  );
};

export default PoemDisplay;
