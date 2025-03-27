// Paper.tsx - Adding title section
import React from "react";
import styles from "./PaperTitle.module.css";

// Title component
export interface PaperTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const PaperTitle: React.FC<PaperTitleProps> = ({
  children,
  className = "",
}) => {
  return <h3 className={`${styles.title} ${className}`}>{children}</h3>;
};

export default PaperTitle;
