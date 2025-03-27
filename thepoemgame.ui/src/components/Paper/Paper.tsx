import React from "react";
import styles from "./Paper.module.css";

// Create a proper interface for the context
interface PaperContextType {
  paperType: "blue-lined" | "blank-white" | "yellow";
}

// Create a context with the interface
const PaperContext = React.createContext<PaperContextType>({
  paperType: "blue-lined",
});

export interface PaperProps {
  children: React.ReactNode;
  paperType?: "blue-lined" | "blank-white" | "yellow";
}

const Paper: React.FC<PaperProps> = ({
  children,
  paperType = "blue-lined",
}) => {
  return (
    <PaperContext.Provider value={{ paperType }}>
      <div className={`${styles.paper} ${styles[paperType]}`}>
        {paperType === "blue-lined" && (
          <div className={styles.verticalLine}></div>
        )}
        {children}
      </div>
    </PaperContext.Provider>
  );
};

export default Paper;

export const usePaper = () => React.useContext(PaperContext);
