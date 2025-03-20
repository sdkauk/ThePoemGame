import React from "react";
import styles from "./label.module.css";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  variant?: "default" | "inline";
}

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = "",
  variant = "default",
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`${styles.label} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
};

export default Label;
