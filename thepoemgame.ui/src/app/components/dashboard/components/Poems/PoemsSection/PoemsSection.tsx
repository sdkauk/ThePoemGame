import React, { useEffect, useState } from "react";
import styles from "./poems-section.module.css";
import Button from "@/components/Button/Button";
import { Poem, poemService, WaitingPoem } from "@/services/poemService";
import PoemsList from "../PoemsList/PoemsList";

interface PoemsSectionProps {
  userId: string;
}

const PoemsSection: React.FC<PoemsSectionProps> = ({ userId }) => {
  const [poems, setPoems] = useState<WaitingPoem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWaitingPoems = async () => {
      try {
        setLoading(true);
        const poems = await poemService.getUserWaitingPoems();
        setPoems(poems);
        setError(null);
      } catch (err) {
        setError("Failed to load waiting poems. Please try again later.");
        console.error("Error fetching waiting poems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitingPoems();
  }, [userId]);

  return (
    <div className={styles.poemsSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Poems</h2>
      </div>

      {loading ? (
        <p className={styles.message}>Loading poems...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : poems.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You don't have any poems waiting for your attention.</p>
          <Button variant="primary" size="md">
            Create a Poem
          </Button>
        </div>
      ) : (
        <PoemsList poems={poems} />
      )}
    </div>
  );
};

export default PoemsSection;
