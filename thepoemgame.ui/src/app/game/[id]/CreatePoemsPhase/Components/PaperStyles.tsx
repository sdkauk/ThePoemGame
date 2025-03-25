import React from "react";
import styles from "./PaperStyles.module.css";

interface PaperProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Clean White Paper
export const BlankWhitePaper: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.blankWhite} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

// Lined Paper with blue lines
export const BlueLined: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.blueLined} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

// Yellowish aged paper with slight texture
export const YellowishPaper: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.yellowish} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

// Graph paper with grid
export const GraphPaper: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.graphPaper} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

// Dotted paper (bullet journal style)
export const DottedPaper: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.dottedPaper} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

// Black Paper with light lines for dramatic contrast
export const BlackPaper: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.blackPaper} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

// Watercolor paper with subtle texture
export const WatercolorPaper: React.FC<PaperProps> = ({
  children,
  className = "",
  style,
}) => (
  <div
    className={`${styles.paperBase} ${styles.watercolorPaper} ${className}`}
    style={style}
  >
    <div className={styles.paperContent}>{children}</div>
  </div>
);

export default {
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  GraphPaper,
  DottedPaper,
  BlackPaper,
  WatercolorPaper,
};
