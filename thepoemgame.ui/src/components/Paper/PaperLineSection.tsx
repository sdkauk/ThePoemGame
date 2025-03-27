// Paper.tsx - Adding basic line section component
import React from "react";
import styles from "./PaperLineSection.module.css";

// Line section component
export interface PaperLineSectionProps {
  children: React.ReactNode;
  className?: string;
  lineNumber?: number;
}

export const PaperLineSection: React.FC<PaperLineSectionProps> = ({
  children,
  className = "",
  lineNumber,
}) => {
  return (
    <div className={`${styles.lineSection} ${className}`}>
      {lineNumber !== undefined && (
        <span className={styles.lineNumber}>{lineNumber}</span>
      )}
      {children}
    </div>
  );
};

export default PaperLineSection;
