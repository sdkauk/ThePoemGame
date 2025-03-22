import React from "react";
import styles from "./FormItem.module.css";

export interface FormItemProps {
  children: React.ReactNode;
  label?: React.ReactNode;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
}

const FormItem: React.FC<FormItemProps> = ({
  children,
  label,
  htmlFor,
  error,
  required = false,
  className = "",
  helpText,
}) => {
  return (
    <div className={`${styles.formItem} ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.control}>{children}</div>
      {helpText && !error && <p className={styles.helpText}>{helpText}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default FormItem;
