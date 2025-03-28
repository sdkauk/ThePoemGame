import React from "react";
import styles from "./Paper.module.css";
import PaperLineWrapper, { PaperLineWrapperProps } from "./PaperLineWrapper";
import PaperTitleSection from "./PaperTitleSection";
import PaperTitle from "./PaperTitle";

// Re-export components for easier imports
export { PaperTitleSection, PaperTitle, PaperLineWrapper };

// Define paper context
interface PaperContextType {
  paperType: "blue-lined" | "blank-white" | "vintage" | "dark" | "watercolor";
  showLineNumbers: boolean;
}

const PaperContext = React.createContext<PaperContextType>({
  paperType: "blue-lined",
  showLineNumbers: true,
});

export interface PaperProps {
  children: React.ReactNode;
  paperType?: "blue-lined" | "blank-white" | "vintage" | "dark" | "watercolor";
  showLineNumbers?: boolean;
  className?: string;
}

const Paper: React.FC<PaperProps> = ({
  children,
  paperType = "blue-lined",
  showLineNumbers = true,
  className = "",
}) => {
  return (
    <PaperContext.Provider value={{ paperType, showLineNumbers }}>
      <div className={`${styles.paper} ${styles[paperType]} ${className}`}>
        {/* Paper edge shadow */}
        <div className={styles.paperEdgeShadow}></div>

        {/* Vertical margin line (for lined paper types) */}
        {paperType === "blue-lined" && (
          <div className={styles.verticalLine}></div>
        )}

        {children}
      </div>
    </PaperContext.Provider>
  );
};

export default Paper;

// Custom hook to access paper context
export const usePaper = () => React.useContext(PaperContext);
