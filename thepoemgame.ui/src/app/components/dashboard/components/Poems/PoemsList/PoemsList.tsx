import React from "react";
import styles from "./PoemsList.module.css";
import { WaitingPoem } from "@/services/poemService";
import PoemCard from "../PoemCard/PoemCard";
import Grid from "@/components/Grid/grid";

interface PoemsListProps {
  poems: WaitingPoem[];
}

const PoemsList: React.FC<PoemsListProps> = ({ poems }) => {
  return (
    <div className={styles.poemsList}>
      <Grid cols={1} gap="md">
        {poems.map((poem) => (
          <PoemCard key={poem.poemId} poem={poem} />
        ))}
      </Grid>
    </div>
  );
};

export default PoemsList;
