// Paper.tsx - Adding title section
import React from "react";
import styles from "./PaperTitleSection.module.css";

// Title section component
export interface PaperTitleSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const PaperTitleSection: React.FC<PaperTitleSectionProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`${styles.titleSection} ${className}`}>{children}</div>
  );
};

export default PaperTitleSection;
