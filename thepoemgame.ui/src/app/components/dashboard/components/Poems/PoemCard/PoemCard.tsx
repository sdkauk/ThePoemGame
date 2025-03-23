import React from "react";
import styles from "./PoemCard.module.css";
import { Poem, LineType, WaitingPoem } from "@/services/poemService";
import Card from "@/components/Card/card";
import Button from "@/components/Button/Button";

interface PoemCardProps {
  poem: WaitingPoem;
}

const PoemCard: React.FC<PoemCardProps> = ({ poem }) => {
  // Format the date
  //   const formattedDate = new Date(poem.createdAt).toLocaleDateString();

  return (
    <Card className={styles.poemCard}>
      <div className={styles.poemHeader}>
        <h3 className={styles.poemTitle}>{poem.title}</h3>
        {/* <span className={styles.poemDate}>{formattedDate}</span> */}
      </div>

      <div className={styles.poemMeta}>
        <span className={styles.poemAuthor}>Started by {poem.author.name}</span>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            /* Handle add line */
          }}
        >
          Add Line
        </Button>
      </div>
    </Card>
  );
};

export default PoemCard;
