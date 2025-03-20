import React from "react";
import styles from "./container.module.css";

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "xxl" | "full";
  padding?: boolean;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "lg",
  padding = true,
  className = "",
}) => {
  return (
    <div
      className={`${styles.container} 
        ${styles[maxWidth]} 
        ${padding ? styles.padding : ""} 
        ${className}}`}
    >
      {children}
    </div>
  );
};

export default Container;
