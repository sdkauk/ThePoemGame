import React from "react";
import styles from "./grid.module.css";

export interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "none" | "sm" | "md" | "lg";
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = "md",
  className = "",
}) => {
  return (
    <div
      className={`
        ${styles.grid}
        ${styles[`cols-${cols}`]}
        ${gap !== "none" ? styles[`gap-${gap}`] : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Grid;
