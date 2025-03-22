import React from "react";
import styles from "./FormFooter.module.css";

export interface FormFooterProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right" | "between";
  className?: string;
}

const FormFooter: React.FC<FormFooterProps> = ({
  children,
  align = "right",
  className = "",
}) => {
  return (
    <div
      className={`${styles.footer} ${styles[`align-${align}`]} ${className}`}
    >
      {children}
    </div>
  );
};

export default FormFooter;
