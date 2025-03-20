import React from "react";
import styles from "./card.module.css";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "flat";
  shadow?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  shadow = "md",
  padding = "md",
}) => {
  return (
    <div
      className={`
        ${styles.card}
        ${styles[variant]}
        ${shadow !== "none" ? styles[`shadow-${shadow}`] : ""}
        ${padding !== "none" ? styles[`padding-${padding}`] : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
