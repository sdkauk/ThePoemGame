import React from "react";
import styles from "./PoemLine.module.css";
import { Author } from "@/services/poemService";

interface PoemLineProps {
  content: string;
  author: Author;
  lineNumber: number;
  isCurrentLine?: boolean;
  isObscured?: boolean;
  className?: string;
}

const PoemLine: React.FC<PoemLineProps> = ({
  content,
  author,
  lineNumber,
  isCurrentLine = false,
  isObscured = false,
  className = "",
}) => {
  return (
    <div
      className={`${styles.poemLine} ${
        isCurrentLine ? styles.currentLine : ""
      } ${className}`}
    >
      {isObscured ? (
        <div className={styles.obscuredLine}>
          <div className={styles.obscuredContent}></div>
        </div>
      ) : (
        <>
          <div className={styles.lineContent}>{content}</div>
          <div className={styles.lineAuthor}>— {author.name}</div>
        </>
      )}
    </div>
  );
};

export default PoemLine;
