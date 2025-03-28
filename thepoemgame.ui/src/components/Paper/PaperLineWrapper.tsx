import React from "react";
import styles from "./PaperLineWrapper.module.css";

interface Author {
  id: string;
  name: string;
}

export interface PaperLineWrapperProps {
  content: string;
  lineNumber?: number;
  author?: Author;
  containerWidth: number;
}

/**
 * LineWrapper component handles displaying poem lines with proper wrapping
 * It will break long lines into multiple segments while preserving the layout
 */
const PaperLineWrapper: React.FC<PaperLineWrapperProps> = ({
  content,
  lineNumber,
  author,
  containerWidth,
}) => {
  // Skip processing if container width is not available yet
  if (containerWidth <= 0) {
    return null;
  }

  // Estimate chars per line based on container width
  // Using an approximate character width based on font size
  const fontSize = 16; // in pixels
  const avgCharWidth = fontSize * 0.55; // approximate character width
  const charsPerLine = Math.floor((containerWidth - 120) / avgCharWidth); // Subtracting padding and margins

  // Wrap the content into multiple segments if needed
  const wrappedContent = wrapText(content, charsPerLine);

  // If content fits on a single line, render it directly
  if (wrappedContent.length === 1) {
    return (
      <div className={styles.lineSection}>
        {lineNumber !== undefined && (
          <span className={styles.lineNumber}>{lineNumber}</span>
        )}
        <div className={styles.lineContent}>
          <span className={styles.lineText}>{content}</span>
          {author && <span className={styles.lineAuthor}>— {author.name}</span>}
        </div>
      </div>
    );
  }

  // For multi-segment lines, render each segment
  return (
    <>
      {wrappedContent.map((segment, index) => {
        const isFirstSegment = index === 0;
        const isLastSegment = index === wrappedContent.length - 1;

        return (
          <div key={`segment-${index}`} className={styles.lineSection}>
            {/* Only show line number on first segment */}
            {isFirstSegment && lineNumber !== undefined && (
              <span className={styles.lineNumber}>{lineNumber}</span>
            )}

            <div className={styles.lineContent}>
              <span className={styles.lineText}>{segment}</span>

              {/* Only show author on last segment */}
              {isLastSegment && author && (
                <span className={styles.lineAuthor}>— {author.name}</span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

/**
 * Helper function to wrap text based on maximum characters per line
 */
function wrapText(text: string, charsPerLine: number): string[] {
  if (text.length <= charsPerLine) return [text];

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentLineLength = 0;

  words.forEach((word) => {
    // Check if adding this word would exceed the line length
    if (
      currentLineLength + word.length + (currentLine.length > 0 ? 1 : 0) >
      charsPerLine
    ) {
      if (currentLine.length > 0) {
        lines.push(currentLine.join(" "));
        currentLine = [word];
        currentLineLength = word.length;
      } else {
        // Word is longer than a line, we still need to add it
        lines.push(word);
        currentLine = [];
        currentLineLength = 0;
      }
    } else {
      currentLine.push(word);
      currentLineLength += word.length + (currentLine.length > 1 ? 1 : 0);
    }
  });

  // Add the last line if there's anything left
  if (currentLine.length > 0) {
    lines.push(currentLine.join(" "));
  }

  return lines;
}

export default PaperLineWrapper;
