import React, { forwardRef } from "react";
import styles from "./input.module.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      fullWidth = false,
      size = "md",
      variant = "default",
      className = "",
      startIcon,
      endIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`${styles.container} ${fullWidth ? styles.fullWidth : ""}`}
      >
        {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
        <input
          ref={ref}
          className={`
            ${styles.input}
            ${styles[size]}
            ${styles[variant]}
            ${error ? styles.error : ""}
            ${disabled ? styles.disabled : ""}
            ${startIcon ? styles.hasStartIcon : ""}
            ${endIcon ? styles.hasEndIcon : ""}
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
        {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
