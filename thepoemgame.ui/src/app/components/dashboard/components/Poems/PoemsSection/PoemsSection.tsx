import React, { useEffect, useState } from "react";
import styles from "./poems-section.module.css";
import Button from "@/components/Button/Button";
import { Poem, poemService } from "@/services/poemService";
import PoemsList from "../PoemsList/poems-list";

interface PoemsSectionProps {
  userId: string;
}

const PoemsSection: React.FC<PoemsSectionProps> = ({ userId }) => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        setLoading(true);
        // This would need to be implemented in the poemService
        const userPoems = await poemService.getUserPoems();
        setPoems(userPoems);
        setError(null);
      } catch (err) {
        setError("Failed to load poems. Please try again later.");
        console.error("Error fetching poems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoems();
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
