import React, { ReactNode } from "react";
import styles from "./LinedPaper.module.css";

interface LinedPaperProps {
  children?: ReactNode;
  title?: string;
  className?: string;
}

const LinedPaper: React.FC<LinedPaperProps> = ({
  children,
  title,
  className = "",
}) => {
  return (
    <div className={`${styles.paperContainer} ${className}`}>
      {title && (
        <div className={styles.titleSection}>
          <h3 className={styles.poemTitle}>{title}</h3>
        </div>
      )}
      <div className={styles.paper}>
        <div className={styles.contentContainer}>{children}</div>
      </div>
    </div>
  );
};

export default LinedPaper;
