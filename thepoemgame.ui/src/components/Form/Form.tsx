import React, { FormHTMLAttributes, forwardRef } from "react";
import styles from "./form.module.css";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    { children, className = "", spacing = "md", fullWidth = false, ...props },
    ref
  ) => {
    return (
      <form
        ref={ref}
        className={`
          ${styles.form} 
          ${styles[`spacing-${spacing}`]}
          ${fullWidth ? styles.fullWidth : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </form>
    );
  }
);

Form.displayName = "Form";

export default Form;
