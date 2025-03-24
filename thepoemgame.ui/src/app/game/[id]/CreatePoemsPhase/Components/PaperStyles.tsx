import React from "react";
import styles from "./PaperStyles.module.css";

interface PaperProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Create simple paper components with minimal styling
export const Paper1: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.paper1} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

export const Paper2: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.paper2} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

export const Paper3: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.paper3} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

export const Paper4: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.paper4} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

export const Paper5: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.paper5} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

// Keep a blank white paper for backward compatibility
export const BlankWhitePaper: React.FC<PaperProps> = Paper1;
export const BlueLined: React.FC<PaperProps> = Paper2;
export const YellowishPaper: React.FC<PaperProps> = Paper3;
export const GraphPaper: React.FC<PaperProps> = Paper4;
export const DottedPaper: React.FC<PaperProps> = Paper5;
export const MarginedPaper: React.FC<PaperProps> = Paper1;

export default {
  Paper1,
  Paper2,
  Paper3,
  Paper4,
  Paper5,
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  GraphPaper,
  DottedPaper,
  MarginedPaper,
};
