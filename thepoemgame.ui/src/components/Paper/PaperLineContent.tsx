// Paper.tsx - Adding basic line section component
import React from "react";
import styles from "./Paper.module.css";

// Line content component
export interface PaperLineContentProps {
  children: React.ReactNode;
  className?: string;
  author?: {
    name: string;
    id: string;
  };
}

export const PaperLineContent: React.FC<PaperLineContentProps> = ({
  children,
  className = "",
  author,
}) => {
  return (
    <div className={`${styles.lineContent} ${className}`}>
      <div className={styles.lineText}>{children}</div>
      {author && <div className={styles.lineAuthor}>— {author.name}</div>}
    </div>
  );
};

export default PaperLineContent;
