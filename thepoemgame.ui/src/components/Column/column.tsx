import React from "react";
import styles from "./column.module.css";

export interface ColumnProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 6 | 12 | "full";
  sm?: 1 | 2 | 3 | 4 | 6 | 12 | "full";
  md?: 1 | 2 | 3 | 4 | 6 | 12 | "full";
  lg?: 1 | 2 | 3 | 4 | 6 | 12 | "full";
  className?: string;
}

const Column: React.FC<ColumnProps> = ({
  children,
  span,
  sm,
  md,
  lg,
  className = "",
}) => {
  return (
    <div
      className={`
        ${styles.column}
        ${span ? styles[`col-span-${span}`] : ""}
        ${sm ? styles[`sm:col-span-${sm}`] : ""}
        ${md ? styles[`md:col-span-${md}`] : ""}
        ${lg ? styles[`lg:col-span-${lg}`] : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Column;
